export default function ElderlyIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="65 yaş aylığını temsil eden illüstrasyon: yaşlı birey ve sosyal destek sembolü"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      {/* Background */}
      <rect width="480" height="320" rx="24" fill="#FFFBEB" />

      {/* Bench */}
      <rect x="120" y="220" width="240" height="14" rx="6" fill="#D97706" opacity="0.7" />
      <rect x="148" y="234" width="12" height="30" rx="4" fill="#D97706" opacity="0.6" />
      <rect x="320" y="234" width="12" height="30" rx="4" fill="#D97706" opacity="0.6" />
      {/* Bench back */}
      <rect x="120" y="196" width="240" height="12" rx="5" fill="#D97706" opacity="0.5" />
      <rect x="162" y="196" width="8" height="24" rx="3" fill="#D97706" opacity="0.5" />
      <rect x="235" y="196" width="8" height="24" rx="3" fill="#D97706" opacity="0.5" />
      <rect x="308" y="196" width="8" height="24" rx="3" fill="#D97706" opacity="0.5" />

      {/* Elderly person 1 */}
      <circle cx="185" cy="160" r="22" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      {/* White hair */}
      <path d="M168,154 Q185,140 202,154" fill="#E5E7EB" />
      <ellipse cx="185" cy="210" rx="22" ry="28" fill="#0D9488" opacity="0.75" />
      {/* Cane */}
      <line x1="207" y1="205" x2="224" y2="250" stroke="#92400E" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="220" cy="254" rx="8" ry="4" fill="#92400E" opacity="0.5" />
      {/* Arm */}
      <line x1="185" y1="192" x2="208" y2="205" stroke="#0D9488" strokeWidth="5" strokeLinecap="round" />

      {/* Elderly person 2 */}
      <circle cx="295" cy="160" r="22" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
      <path d="M278,154 Q295,140 312,154" fill="#E5E7EB" />
      <ellipse cx="295" cy="210" rx="22" ry="28" fill="#F97316" opacity="0.75" />
      {/* Book */}
      <rect x="270" y="198" width="22" height="16" rx="3" fill="#0D9488" />
      <line x1="281" y1="198" x2="281" y2="214" stroke="#F0FDFA" strokeWidth="1.5" />

      {/* "65" badge */}
      <circle cx="240" cy="88" r="42" fill="#FEF3C7" stroke="#F97316" strokeWidth="3" />
      <text x="240" y="102" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="36" fontWeight="700" fill="#D97706">65</text>

      {/* Stars / sparkles around badge */}
      <path d="M192,64 L194,70 L200,70 L195,74 L197,80 L192,76 L187,80 L189,74 L184,70 L190,70Z" fill="#FCD34D" opacity="0.8" />
      <path d="M286,58 L288,63 L293,63 L289,66 L291,71 L286,68 L281,71 L283,66 L279,63 L284,63Z" fill="#FCD34D" opacity="0.8" />

      {/* Ground line */}
      <line x1="60" y1="268" x2="420" y2="268" stroke="#D97706" strokeWidth="2" opacity="0.25" />

      {/* Tree */}
      <rect x="58" y="210" width="12" height="58" rx="4" fill="#92400E" opacity="0.7" />
      <circle cx="64" cy="190" r="30" fill="#4ADE80" opacity="0.55" />
      <circle cx="52" cy="204" r="20" fill="#4ADE80" opacity="0.45" />
      <circle cx="78" cy="200" r="22" fill="#4ADE80" opacity="0.45" />

      {/* Tree 2 */}
      <rect x="406" y="218" width="12" height="50" rx="4" fill="#92400E" opacity="0.7" />
      <circle cx="412" cy="198" r="28" fill="#4ADE80" opacity="0.55" />

      {/* Sun */}
      <circle cx="420" cy="52" r="20" fill="#FEF08A" stroke="#F97316" strokeWidth="2" />
      <line x1="420" y1="24" x2="420" y2="17" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="420" y1="80" x2="420" y2="87" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="392" y1="52" x2="385" y2="52" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
      <line x1="448" y1="52" x2="455" y2="52" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />

      {/* Label */}
      <text x="240" y="298" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fill="#B45309" fontWeight="600">65 Yaş Aylığı Uygunluk Testi</text>
    </svg>
  );
}
