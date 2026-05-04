export default function HomeCareIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Evde bakım hizmetini temsil eden illüstrasyon: bir bakıcı ve yaşlı birey"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      {/* Background */}
      <rect width="480" height="320" rx="24" fill="#F0FDFA" />

      {/* House shape */}
      <polygon points="240,40 340,120 340,240 140,240 140,120" fill="#CCFBF1" stroke="#0D9488" strokeWidth="2.5" />
      <rect x="200" y="160" width="80" height="80" rx="4" fill="#99F6E4" />
      {/* Door */}
      <rect x="215" y="190" width="50" height="50" rx="6" fill="#0D9488" opacity="0.8" />
      <circle cx="259" cy="216" r="3" fill="#F0FDFA" />
      {/* Window */}
      <rect x="155" y="140" width="36" height="36" rx="5" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1.5" />
      <line x1="173" y1="140" x2="173" y2="176" stroke="#0D9488" strokeWidth="1.5" />
      <line x1="155" y1="158" x2="191" y2="158" stroke="#0D9488" strokeWidth="1.5" />
      {/* Second window */}
      <rect x="290" y="140" width="36" height="36" rx="5" fill="#F0FDFA" stroke="#0D9488" strokeWidth="1.5" />
      <line x1="308" y1="140" x2="308" y2="176" stroke="#0D9488" strokeWidth="1.5" />
      <line x1="290" y1="158" x2="326" y2="158" stroke="#0D9488" strokeWidth="1.5" />
      {/* Roof ridge */}
      <line x1="240" y1="40" x2="240" y2="80" stroke="#0D9488" strokeWidth="2" strokeDasharray="4 3" />

      {/* Caregiver figure (left) */}
      <circle cx="110" cy="175" r="18" fill="#FED7AA" stroke="#F97316" strokeWidth="2" />
      <ellipse cx="110" cy="230" rx="20" ry="30" fill="#F97316" opacity="0.9" />
      {/* Caregiver arm extended */}
      <line x1="110" y1="215" x2="140" y2="230" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      {/* Hair */}
      <path d="M96,168 Q110,155 124,168" fill="#92400E" />

      {/* Elderly person (right) */}
      <circle cx="370" cy="178" r="16" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <ellipse cx="370" cy="228" rx="17" ry="26" fill="#D97706" opacity="0.8" />
      {/* Cane */}
      <line x1="388" y1="220" x2="405" y2="258" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
      <line x1="397" y1="256" x2="410" y2="256" stroke="#92400E" strokeWidth="3" strokeLinecap="round" />

      {/* Heart symbol */}
      <path d="M228,88 C228,83 233,78 238,83 C243,78 248,83 248,88 C248,94 238,102 238,102 C238,102 228,94 228,88Z" fill="#F97316" opacity="0.85" />

      {/* Ground line */}
      <line x1="60" y1="254" x2="420" y2="254" stroke="#0D9488" strokeWidth="2" opacity="0.3" />

      {/* Grass tufts */}
      <path d="M80,254 Q84,244 88,254" stroke="#0D9488" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M100,254 Q104,248 108,254" stroke="#0D9488" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M380,254 Q384,246 388,254" stroke="#0D9488" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M400,254 Q404,249 408,254" stroke="#0D9488" strokeWidth="2" fill="none" opacity="0.5" />

      {/* Sun */}
      <circle cx="420" cy="60" r="22" fill="#FEF08A" stroke="#F97316" strokeWidth="2" />
      <line x1="420" y1="28" x2="420" y2="20" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="420" y1="92" x2="420" y2="100" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="388" y1="60" x2="380" y2="60" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="448" y1="60" x2="456" y2="60" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />

      {/* Label */}
      <text x="240" y="292" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fill="#0F766E" fontWeight="600">Evde Bakım Desteği</text>
    </svg>
  );
}
