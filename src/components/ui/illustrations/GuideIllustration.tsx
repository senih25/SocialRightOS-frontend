export default function GuideIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Rehber ve bilgi kaynaklarını temsil eden illüstrasyon: kitap, pusula ve yol gösterme sembolü"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      {/* Background */}
      <rect width="480" height="320" rx="24" fill="#F8FAFC" />

      {/* Open book */}
      <path d="M120,80 Q120,220 240,230 Q360,220 360,80" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      {/* Left page */}
      <path d="M120,80 Q120,215 240,225 L240,70 Q180,65 120,80Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Right page */}
      <path d="M360,80 Q360,215 240,225 L240,70 Q300,65 360,80Z" fill="white" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Book spine */}
      <line x1="240" y1="70" x2="240" y2="225" stroke="#CBD5E1" strokeWidth="2" />
      {/* Book cover top */}
      <path d="M118,80 Q240,60 362,80" fill="#0D9488" stroke="#0D9488" strokeWidth="1" />

      {/* Text lines on left page */}
      <line x1="140" y1="110" x2="222" y2="110" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="124" x2="222" y2="124" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="138" x2="210" y2="138" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="160" x2="222" y2="160" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="174" x2="218" y2="174" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="188" x2="222" y2="188" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="140" y1="202" x2="200" y2="202" stroke="#CBD5E1" strokeWidth="2" />

      {/* Text lines on right page */}
      <line x1="258" y1="110" x2="340" y2="110" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="258" y1="124" x2="340" y2="124" stroke="#CBD5E1" strokeWidth="2" />
      <line x1="258" y1="138" x2="325" y2="138" stroke="#CBD5E1" strokeWidth="2" />

      {/* Checklist on right page */}
      <rect x="258" y="152" width="16" height="16" rx="3" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
      <path d="M261,160 L265,165 L272,155" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="282" y1="160" x2="335" y2="160" stroke="#CBD5E1" strokeWidth="2" />

      <rect x="258" y="174" width="16" height="16" rx="3" fill="#CCFBF1" stroke="#0D9488" strokeWidth="1.5" />
      <path d="M261,182 L265,187 L272,177" stroke="#0D9488" strokeWidth="2" fill="none" strokeLinecap="round" />
      <line x1="282" y1="182" x2="330" y2="182" stroke="#CBD5E1" strokeWidth="2" />

      <rect x="258" y="196" width="16" height="16" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1.5" />
      <line x1="282" y1="204" x2="320" y2="204" stroke="#CBD5E1" strokeWidth="2" />

      {/* Compass (top right) */}
      <circle cx="400" cy="100" r="42" fill="white" stroke="#0D9488" strokeWidth="2.5" />
      <circle cx="400" cy="100" r="34" fill="#F0FDFA" />
      {/* Compass needle */}
      <polygon points="400,72 404,100 400,98 396,100" fill="#F97316" />
      <polygon points="400,128 404,100 400,102 396,100" fill="#64748B" />
      {/* Cardinal directions */}
      <text x="400" y="66" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#0D9488">K</text>
      <text x="400" y="138" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#64748B">G</text>
      <text x="364" y="104" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#64748B">B</text>
      <text x="436" y="104" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="700" fill="#64748B">D</text>
      <circle cx="400" cy="100" r="4" fill="#0D9488" />

      {/* Magnifying glass (bottom left) */}
      <circle cx="68" cy="210" r="30" fill="white" stroke="#0D9488" strokeWidth="2.5" />
      <circle cx="68" cy="210" r="22" fill="#F0FDFA" />
      <line x1="91" y1="233" x2="108" y2="250" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" />
      {/* Inner search icon */}
      <line x1="58" y1="210" x2="78" y2="210" stroke="#0D9488" strokeWidth="2" />
      <line x1="68" y1="200" x2="68" y2="220" stroke="#0D9488" strokeWidth="2" />

      {/* Lightbulb (top left) */}
      <path d="M68,52 Q68,30 88,28 Q108,30 108,52 Q108,66 96,72 L96,80 L80,80 L80,72 Q68,66 68,52Z" fill="#FEF08A" stroke="#D97706" strokeWidth="2" />
      <line x1="80" y1="84" x2="96" y2="84" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <line x1="81" y1="90" x2="95" y2="90" stroke="#D97706" strokeWidth="2" strokeLinecap="round" />
      <path d="M84,52 Q88,44 92,52" stroke="#F97316" strokeWidth="2" fill="none" />

      {/* Label */}
      <text x="240" y="264" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fill="#475569" fontWeight="600">Rehber ve Bilgi Kaynakları</text>
    </svg>
  );
}
