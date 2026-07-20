BEGIN;

CREATE SCHEMA IF NOT EXISTS socialright;

CREATE TABLE IF NOT EXISTS socialright.guidance_budget_state (
  singleton_id smallint PRIMARY KEY CHECK (singleton_id = 1),
  hard_limit_micros bigint NOT NULL CHECK (hard_limit_micros >= 0),
  committed_micros bigint NOT NULL DEFAULT 0 CHECK (committed_micros >= 0),
  reserved_micros bigint NOT NULL DEFAULT 0 CHECK (reserved_micros >= 0),
  updated_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS socialright.guidance_budget_reservations (
  reservation_id uuid PRIMARY KEY,
  maximum_cost_micros bigint NOT NULL CHECK (maximum_cost_micros > 0),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE TABLE IF NOT EXISTS socialright.guidance_client_locks (
  client_key_hash char(64) PRIMARY KEY
    CHECK (client_key_hash ~ '^[0-9a-f]{64}$')
);

CREATE TABLE IF NOT EXISTS socialright.guidance_client_attempts (
  attempt_id uuid PRIMARY KEY,
  client_key_hash char(64) NOT NULL
    CHECK (client_key_hash ~ '^[0-9a-f]{64}$'),
  attempted_at timestamptz NOT NULL DEFAULT clock_timestamp()
);

CREATE INDEX IF NOT EXISTS guidance_client_attempts_window_idx
  ON socialright.guidance_client_attempts (client_key_hash, attempted_at);

CREATE TABLE IF NOT EXISTS socialright.guidance_assessment_generations (
  assessment_version_key_hash char(64) PRIMARY KEY
    CHECK (assessment_version_key_hash ~ '^[0-9a-f]{64}$'),
  lease_id uuid NOT NULL UNIQUE,
  state text NOT NULL CHECK (state IN ('IN_FLIGHT', 'COMPLETED')),
  created_at timestamptz NOT NULL DEFAULT clock_timestamp(),
  completed_at timestamptz
);

CREATE OR REPLACE FUNCTION socialright.reserve_guidance_budget(
  p_reservation_id uuid,
  p_maximum_cost_micros bigint,
  p_hard_limit_micros bigint
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
DECLARE
  v_acquired boolean;
BEGIN
  IF p_maximum_cost_micros <= 0 OR p_hard_limit_micros < 0 THEN
    RETURN false;
  END IF;

  INSERT INTO socialright.guidance_budget_state (singleton_id, hard_limit_micros)
  VALUES (1, p_hard_limit_micros)
  ON CONFLICT (singleton_id) DO NOTHING;

  UPDATE socialright.guidance_budget_state
  SET reserved_micros = reserved_micros + p_maximum_cost_micros,
      updated_at = clock_timestamp()
  WHERE singleton_id = 1
    AND hard_limit_micros = p_hard_limit_micros
    AND committed_micros + reserved_micros + p_maximum_cost_micros
      <= hard_limit_micros
  RETURNING true INTO v_acquired;

  IF v_acquired IS DISTINCT FROM true THEN
    RETURN false;
  END IF;

  INSERT INTO socialright.guidance_budget_reservations (
    reservation_id,
    maximum_cost_micros
  ) VALUES (p_reservation_id, p_maximum_cost_micros);
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION socialright.settle_guidance_budget(
  p_reservation_id uuid,
  p_actual_cost_micros bigint
) RETURNS TABLE(found boolean, exceeded_reservation boolean)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
DECLARE
  v_maximum_cost_micros bigint;
BEGIN
  IF p_actual_cost_micros < 0 THEN
    RETURN QUERY SELECT false, false;
    RETURN;
  END IF;

  DELETE FROM socialright.guidance_budget_reservations
  WHERE reservation_id = p_reservation_id
  RETURNING maximum_cost_micros INTO v_maximum_cost_micros;

  IF v_maximum_cost_micros IS NULL THEN
    RETURN QUERY SELECT false, false;
    RETURN;
  END IF;

  UPDATE socialright.guidance_budget_state
  SET reserved_micros = reserved_micros - v_maximum_cost_micros,
      committed_micros = committed_micros
        + LEAST(p_actual_cost_micros, v_maximum_cost_micros),
      updated_at = clock_timestamp()
  WHERE singleton_id = 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'guidance budget state unavailable';
  END IF;

  RETURN QUERY SELECT true, p_actual_cost_micros > v_maximum_cost_micros;
END;
$$;

CREATE OR REPLACE FUNCTION socialright.release_guidance_budget(
  p_reservation_id uuid
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
DECLARE
  v_maximum_cost_micros bigint;
BEGIN
  DELETE FROM socialright.guidance_budget_reservations
  WHERE reservation_id = p_reservation_id
  RETURNING maximum_cost_micros INTO v_maximum_cost_micros;

  IF v_maximum_cost_micros IS NULL THEN
    RETURN false;
  END IF;

  UPDATE socialright.guidance_budget_state
  SET reserved_micros = reserved_micros - v_maximum_cost_micros,
      updated_at = clock_timestamp()
  WHERE singleton_id = 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'guidance budget state unavailable';
  END IF;
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION socialright.acquire_guidance_request(
  p_lease_id uuid,
  p_attempt_id uuid,
  p_client_key_hash text,
  p_assessment_version_key_hash text,
  p_maximum_attempts integer,
  p_window_ms bigint
) RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
DECLARE
  v_attempt_count bigint;
  v_inserted boolean;
BEGIN
  IF p_client_key_hash !~ '^[0-9a-f]{64}$'
    OR p_assessment_version_key_hash !~ '^[0-9a-f]{64}$'
    OR p_maximum_attempts < 1 OR p_maximum_attempts > 1000
    OR p_window_ms < 1 OR p_window_ms > 31536000000 THEN
    RETURN false;
  END IF;

  INSERT INTO socialright.guidance_client_locks (client_key_hash)
  VALUES (p_client_key_hash)
  ON CONFLICT (client_key_hash) DO NOTHING;

  PERFORM client_key_hash
  FROM socialright.guidance_client_locks
  WHERE client_key_hash = p_client_key_hash
  FOR UPDATE;

  DELETE FROM socialright.guidance_client_attempts
  WHERE client_key_hash = p_client_key_hash
    AND attempted_at <= clock_timestamp() - (p_window_ms * interval '1 millisecond');

  SELECT count(*) INTO v_attempt_count
  FROM socialright.guidance_client_attempts
  WHERE client_key_hash = p_client_key_hash;

  IF v_attempt_count >= p_maximum_attempts THEN
    RETURN false;
  END IF;

  INSERT INTO socialright.guidance_client_attempts (attempt_id, client_key_hash)
  VALUES (p_attempt_id, p_client_key_hash);

  INSERT INTO socialright.guidance_assessment_generations (
    assessment_version_key_hash,
    lease_id,
    state
  ) VALUES (p_assessment_version_key_hash, p_lease_id, 'IN_FLIGHT')
  ON CONFLICT (assessment_version_key_hash) DO NOTHING
  RETURNING true INTO v_inserted;

  RETURN v_inserted IS TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION socialright.complete_guidance_request(
  p_lease_id uuid
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
  WITH updated AS (
    UPDATE socialright.guidance_assessment_generations
    SET state = 'COMPLETED', completed_at = clock_timestamp()
    WHERE lease_id = p_lease_id AND state = 'IN_FLIGHT'
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM updated);
$$;

CREATE OR REPLACE FUNCTION socialright.release_guidance_request(
  p_lease_id uuid
) RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = pg_catalog, socialright
AS $$
  WITH deleted AS (
    DELETE FROM socialright.guidance_assessment_generations
    WHERE lease_id = p_lease_id AND state = 'IN_FLIGHT'
    RETURNING 1
  )
  SELECT EXISTS (SELECT 1 FROM deleted);
$$;

REVOKE ALL ON SCHEMA socialright FROM PUBLIC;
REVOKE ALL ON ALL TABLES IN SCHEMA socialright FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.reserve_guidance_budget(uuid, bigint, bigint)
  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.settle_guidance_budget(uuid, bigint)
  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.release_guidance_budget(uuid)
  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.acquire_guidance_request(
  uuid, uuid, text, text, integer, bigint
) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.complete_guidance_request(uuid)
  FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION socialright.release_guidance_request(uuid)
  FROM PUBLIC;

COMMIT;
