export default function GssIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 480 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Genel sağlık sigortasını temsil eden illüstrasyon: sağlık ve gelir değerlendirmesi sembolü"
      className={className}
      style={{ width: "100%", height: "auto" }}
    >
      {/* Background */}
      <rect width="480" height="320" rx="24" fill="#F0FDFA" />

      {/* Large shield */}
      <path d="M240,30 L320,65 L320,155 Q320,210 240,240 Q160,210 160,155 L160,65Z" fill="#CCFBF1" stroke="#0D9488" strokeWidth="3" />
      {/* Shield inner */}
      <path d="M240,52 L306,82 L306,158 Q306,202 240,224 Q174,202 174,158 L174,82Z" fill="#F0FDFA" opacity="0.8" />

      {/* Medical cross on shield */}
      <rect x="222" y="108" width="36" height="12" rx="4" fill="#0D9488" />
      <rect x="234" y="96" width="12" height="36" rx="4" fill="#0D9488" />

      {/* Coins stack (left) */}
      <ellipse cx="100" cy="240" rx="32" ry="10" fill="#FCD34D" stroke="#D97706" strokeWidth="1.5" />
      <rect x="68" y="216" width="64" height="24" fill="#FCD34D" />
      <ellipse cx="100" cy="216" rx="32" ry="10" fill="#FEF08A" stroke="#D97706" strokeWidth="1.5" />
      <rect x="68" y="198" width="64" height="18" fill="#FEF08A" />
      <ellipse cx="100" cy="198" rx="32" ry="10" fill="#FEFCE8" stroke="#D97706" strokeWidth="1.5" />
      <text x="100" y="224" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fontWeight="700" fill="#D97706">TL</text>

      {/* Document (right) */}
      <rect x="354" y="170" width="76" height="90" rx="8" fill="white" stroke="#0D9488" strokeWidth="2" />
      <rect x="354" y="170" width="76" height="22" rx="8" fill="#0D9488" />
      <text x="392" y="186" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="9" fontWeight="700" fill="white">GSS</text>
      <line x1="368" y1="206" x2="416" y2="206" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="368" y1="218" x2="416" y2="218" stroke="#CBD5E1" strokeWidth="1.5" />
      <line x1="368" y1="230" x2="402" y2="230" stroke="#CBD5E1" strokeWidth="1.5" />
      {/* Checkmark on document */}
      <path d="M374,246 L382,254 L410,234" stroke="#0D9488" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* People silhouettes (family) */}
      <circle cx="70" cy="150" r="12" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      <ellipse cx="70" cy="180" rx="12" ry="18" fill="#0D9488" opacity="0.7" />
      <circle cx="96" cy="158" r="10" fill="#FDE68A" stroke="#D97706" strokeWidth="1.5" />
      <ellipse cx="96" cy="185" rx="10" ry="15" fill="#F97316" opacity="0.7" />
      <circle cx="52" cy="158" r="8" fill="#FEF9C3" stroke="#D97706" strokeWidth="1.5" />
      <ellipse cx="52" cy="183" rx="8" ry="12" fill="#0D9488" opacity="0.55" />

      {/* Arrow from people to shield */}
      <path d="M110,165 Q135,150 158,130" stroke="#0D9488" strokeWidth="2" fill="none" strokeDasharray="5 3" markerEnd="url(#arr1)" />
      <defs>
        <marker id="arr1" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8Z" fill="#0D9488" />
        </marker>
      </defs>

      {/* Arrow from shield to document */}
      <path d="M322,135 Q345,140 352,175" stroke="#0D9488" strokeWidth="2" fill="none" strokeDasharray="5 3" markerEnd="url(#arr2)" />
      <defs>
        <marker id="arr2" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8Z" fill="#0D9488" />
        </marker>
      </defs>

      {/* Label */}
      <text x="240" y="270" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="13" fill="#0F766E" fontWeight="600">GSS Gelir Testi</text>
      <text x="240" y="288" textAnchor="middle" fontFamily="system-ui, sans-serif" fontSize="11" fill="#64748B">Genel Sağlık Sigortası Uygunluk Değerlendirmesi</text>
    </svg>
  );
}
