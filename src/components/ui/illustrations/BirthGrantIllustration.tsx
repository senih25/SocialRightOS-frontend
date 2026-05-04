export default function BirthGrantIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Doğum yardımını temsil eden illüstrasyon: bebek ve aile desteği sembolü"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      {/* Background */}
      <rect width="480" height="320" rx="24" fill="#FFF7ED" />

      {/* Soft clouds */}
      <ellipse cx="80" cy="70" rx="50" ry="22" fill="#FEF3C7" opacity="0.8" />
      <ellipse cx="55" cy="72" rx="28" ry="18" fill="#FEF3C7" opacity="0.8" />
      <ellipse cx="105" cy="72" rx="28" ry="18" fill="#FEF3C7" opacity="0.8" />
      <ellipse cx="390" cy="60" rx="48" ry="20" fill="#FEF3C7" opacity="0.8" />
      <ellipse cx="368" cy="62" rx="28" ry="16" fill="#FEF3C7" opacity="0.8" />

      {/* Baby bassinet */}
      <ellipse cx="240" cy="220" rx="90" ry="22" fill="#FED7AA" stroke="#F97316" strokeWidth="2.5" />
      <path d="M152,218 Q160,160 240,155 Q320,160 328,218" fill="#FFEDD5" stroke="#F97316" strokeWidth="2.5" />
      {/* Hood */}
      <path d="M152,218 Q180,130 240,125 Q300,130 328,218" fill="none" stroke="#F97316" strokeWidth="2" strokeDasharray="6 4" />

      {/* Baby */}
      <ellipse cx="240" cy="188" rx="32" ry="28" fill="#FEF9C3" stroke="#FCD34D" strokeWidth="2" />
      {/* Baby face */}
      <circle cx="231" cy="184" r="3" fill="#D97706" />
      <circle cx="249" cy="184" r="3" fill="#D97706" />
      <path d="M234,195 Q240,200 246,195" stroke="#D97706" strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* Baby cap */}
      <ellipse cx="240" cy="166" rx="28" ry="14" fill="#FB923C" />
      <path d="M214,170 Q240,158 266,170" fill="#FB923C" />
      <circle cx="240" cy="154" r="5" fill="#F97316" />

      {/* Mother figure */}
      <circle cx="130" cy="155" r="24" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <ellipse cx="130" cy="215" rx="26" ry="36" fill="#0D9488" opacity="0.8" />
      <path d="M130,172 C130,172 160,188 160,205" stroke="#0D9488" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M110,148 Q130,132 150,148" fill="#92400E" />

      {/* Father figure */}
      <circle cx="350" cy="155" r="24" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <ellipse cx="350" cy="215" rx="26" ry="36" fill="#0F766E" opacity="0.8" />
      <path d="M350,172 C350,172 320,188 320,205" stroke="#0F766E" strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M330,148 Q350,134 370,148" fill="#1C1917" />

      {/* Stars */}
      <path d="M240,52 L243,62 L254,62 L246,69 L249,79 L240,72 L231,79 L234,69 L226,62 L237,62Z" fill="#FCD34D" />
      <path d="M180,80 L182,86 L189,86 L184,90 L186,96 L180,92 L174,96 L176,90 L171,86 L178,86Z" fill="#FCD34D" opacity="0.7" />
      <path d="M298,75 L300,81 L307,81 L302,85 L304,91 L298,87 L292,91 L294,85 L289,81 L296,81Z" fill="#FCD34D" opacity="0.7" />

      {/* Heart */}
      <path d="M235,105 C235,100 239,96 242,100 C245,96 249,100 249,105 C249,110 242,117 242,117 C242,117 235,110 235,105Z" fill="#F97316" />

      {/* Ground */}
      <line x1="60" y1="262" x2="420" y2="262" stroke="#F97316" strokeWidth="1.5" opacity="0.25" />

      {/* Label */}
      <text x="240" y="293" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fill="#C2410C" fontWeight="600">Doğum Yardımı Uygunluk Testi</text>
    </svg>
  );
}
