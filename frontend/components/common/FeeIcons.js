const base = (size) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75,
  strokeLinecap: "round", strokeLinejoin: "round",
});

export const IconWallet = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M16 12h4v2h-4a1 1 0 0 1 0-2z" />
    <path d="M3 9h13" />
  </svg>
);

export const IconReceipt = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </svg>
);

export const IconAlert = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3l10 18H2L12 3z" />
    <path d="M12 10v5" />
    <circle cx="12" cy="18" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

export const IconCheck = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

export const IconCheckCircle = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

export const IconClock = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const IconUsers = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
    <circle cx="9.5" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export const IconCalendar = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
);

export const IconChart = ({ size = 20, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M3 3v18h18" />
    <path d="M7 15v3M11 11v7M15 8v10M19 5v13" />
  </svg>
);

export const IconTrendUp = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M7 17L17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

export const IconTrendDown = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M7 7l10 10" />
    <path d="M17 9v8H9" />
  </svg>
);

export const IconSearch = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </svg>
);

export const IconDownload = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 3v12" />
    <path d="M7 10l5 5 5-5" />
    <path d="M5 21h14" />
  </svg>
);

export const IconPlus = ({ size = 18, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconArrowLeft = ({ size = 16, className = "" }) => (
  <svg {...base(size)} className={className}>
    <path d="M19 12H5" />
    <path d="M12 5l-7 7 7 7" />
  </svg>
);

export const IconEmptyReceipt = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <path d="M16 8h32v48l-6-4-6 4-6-4-6 4-6-4-6 4V8z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" opacity="0.35" />
    <path d="M24 22h16M24 30h16M24 38h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
  </svg>
);

export const IconEmptyCard = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <rect x="8" y="16" width="48" height="32" rx="4" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
    <path d="M8 26h48" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
    <path d="M18 40h10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
  </svg>
);

export const IconEmptyUser = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="32" cy="24" r="10" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
    <path d="M12 54c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
  </svg>
);

export const IconEmptySearch = ({ size = 48, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    <circle cx="28" cy="28" r="16" stroke="currentColor" strokeWidth="2.5" opacity="0.35" />
    <path d="M52 52l-14-14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
  </svg>
);