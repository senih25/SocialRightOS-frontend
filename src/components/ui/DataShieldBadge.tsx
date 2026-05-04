export default function DataShieldBadge() {
  return (
    <div
      className="data-shield-badge"
      aria-label="Dijital Veri Zırhı — D-SHR gizlilik güvencesi"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/d-shr-logo.svg"
        alt="D-SHR logosu"
        aria-hidden="true"
        width={52}
        height={52}
        style={{ width: "52px", height: "auto", objectFit: "contain", flexShrink: 0 }}
      />
      <div>
        <p className="data-shield-title">D-SHR Veri Güvencesi</p>
        <ul className="data-shield-list" role="list">
          <li>✓ Verileriniz sunucuda tutulmaz</li>
          <li>✓ Çerez kullanılmaz</li>
          <li>✓ %100 anonim analiz</li>
        </ul>
      </div>
    </div>
  );
}
