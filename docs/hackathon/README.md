# RightFlow Autopilot — Qwen Cloud Hackathon

RightFlow Autopilot is an explainable social-rights caseworker for the **Autopilot Agent** track. It converts ambiguous citizen narratives into a structured case, pauses for human verification, and only then permits a deterministic eligibility engine to run.

## Why it matters

People describe life situations, not policy schemas. Conventional forms require users to understand program names and eligibility rules before they can ask for help. RightFlow closes that intake gap while keeping high-impact decisions outside the language model.

## System boundary

- Qwen Cloud: explicit fact extraction and bounded workflow orchestration.
- Policy guardrail: input normalization, prompt-injection handling, schema validation, timeouts, and fail-closed fallback.
- Deterministic tools: eligibility decisions and rule traces.
- Human checkpoint: extracted facts must be reviewed before consequential tool execution.
- Deterministic program screening: after approval, the case is routed to older-person support, home-care support, and GSS income review pathways with explicit missing information.
- Audit timeline: exposes each stage without persisting the raw narrative.

## Run locally

```bash
npm ci
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000/rightflow-autopilot`.

Set `QWEN_API_KEY` to use Qwen Cloud. Without a key, the project enters an explicitly labelled deterministic demo mode so reviewers can still test the safety and approval workflow.

## Alibaba Cloud deployment proof

The project is container-ready through the root `Dockerfile`. The deployment manifest in [`alibaba-cloud/ecs-compose.yaml`](./alibaba-cloud/ecs-compose.yaml) runs that image on an Alibaba Cloud ECS instance. Qwen calls are made from [`src/lib/qwen-rightflow.ts`](../../src/lib/qwen-rightflow.ts) using the official international DashScope endpoint.

Recommended production target:

1. Build and push the Docker image to Alibaba Cloud Container Registry.
2. Run the image on ECS with the supplied compose manifest.
3. Inject `QWEN_API_KEY` through the ECS environment or Alibaba Cloud KMS; never commit it.
4. Terminate TLS at Alibaba Cloud SLB or an ECS reverse proxy.

## Safety and privacy

- Raw narratives are processed in memory and are not written to application storage.
- Qwen output is rejected unless it matches the fact allowlist; the live call has a bounded 25-second timeout.
- The model cannot produce or override an eligibility decision.
- Tool execution is bounded by an explicit approval state.
- Model failure falls back to a labelled demo extractor, not an invented AI result.

## Significant hackathon update

The base social-rights frontend predates the submission period. The following substantial components were created for this hackathon:

- Qwen Cloud fact-extraction adapter
- autonomous case-intake API
- prompt-injection boundary and strict fact schema
- human approval gate
- auditable agent timeline
- dedicated RightFlow workspace
- Alibaba Cloud deployment manifest and submission documentation

## Demo script

1. Paste the included example narrative.
2. Start safe orchestration.
3. Show the Qwen or deterministic-demo mode badge.
4. Review structured facts and confidence.
5. Show the human approval gate and explain why no eligibility result is emitted yet.
6. Approve the facts and show the three bounded program-screening cards.
7. Walk through the expanded audit timeline and Alibaba Cloud deployment evidence.
