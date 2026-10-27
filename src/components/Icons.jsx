// All icons are inline SVG so they stay crisp and inherit text colour (currentColor).
const base = (size, extra = {}) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
  ...extra,
});

export const SearchIcon = ({ size = 24 }) => (
  <svg {...base(size)}><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></svg>
);
export const UserIcon = ({ size = 24 }) => (
  <svg {...base(size)}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
export const HeartIcon = ({ size = 24, filled = false }) => (
  <svg {...base(size, { fill: filled ? "currentColor" : "none" })}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
export const BagIcon = ({ size = 24 }) => (
  <svg {...base(size)}>
    <path d="M5 8h14l1 12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const MenuIcon = ({ size = 24 }) => (
  <svg {...base(size)}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const CloseIcon = ({ size = 24 }) => (
  <svg {...base(size)}><path d="M18 6L6 18M6 6l12 12" /></svg>
);
export const CameraIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
export const HomeIcon = ({ size = 28 }) => (
  <svg {...base(size, { strokeWidth: 1.8 })}>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </svg>
);
export const VideoIcon = ({ size = 34 }) => (
  <svg {...base(size, { strokeWidth: 2 })}>
    <rect x="2" y="6" width="13" height="12" rx="2.5" />
    <path d="M22 8.5v7l-5-3.5z" />
  </svg>
);
export const ShareIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <path d="M17 8l-5-5-5 5" />
    <path d="M12 3v12" />
  </svg>
);
export const ChevronDown = ({ size = 18 }) => (
  <svg {...base(size)}><path d="M6 9l6 6 6-6" /></svg>
);
export const ChevronLeft = ({ size = 18 }) => (
  <svg {...base(size)}><path d="M15 18l-6-6 6-6" /></svg>
);
export const ChevronRight = ({ size = 18 }) => (
  <svg {...base(size)}><path d="M9 18l6-6-6-6" /></svg>
);
export const ArrowRight = ({ size = 22 }) => (
  <svg {...base(size)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const CheckIcon = ({ size = 18 }) => (
  <svg {...base(size, { strokeWidth: 2 })}><path d="M20 6L9 17l-5-5" /></svg>
);
export const ZoomIcon = ({ size = 18 }) => (
  <svg {...base(size)}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
  </svg>
);
export const InstagramIcon = ({ size = 22 }) => (
  <svg {...base(size, { strokeWidth: 1.8 })}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.5 6.5h.01" />
  </svg>
);
export const YoutubeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12 31 31 0 0 0 1 16.8a3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 23.5 12 31 31 0 0 0 23 7.2z"
    />
    <path fill="#fff" d="M9.75 15.02V8.98L15.5 12z" />
  </svg>
);

/* ---- Product page icons ---- */
export const StoreIcon = ({ size = 44 }) => (
  <svg {...base(size, { viewBox: "0 0 48 48", strokeWidth: 1.4 })}>
    <path d="M7 19l3-11h28l3 11" />
    <path d="M7 19a5 5 0 0 0 10 0 5 5 0 0 0 7 0 5 5 0 0 0 7 0 5 5 0 0 0 10 0" />
    <path d="M10 24v16h28V24" />
    <rect x="19" y="29" width="10" height="11" />
    <path d="M34 4a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4z" />
  </svg>
);
export const TruckIcon = ({ size = 44 }) => (
  <svg {...base(size, { viewBox: "0 0 48 48", strokeWidth: 1.4 })}>
    <path d="M16 12h18v22H16z" />
    <path d="M34 20h6l5 6v8H34" />
    <circle cx="23" cy="36" r="3.5" />
    <circle cx="40" cy="36" r="3.5" />
    <path d="M3 18h9M6 24h8M2 30h10" />
  </svg>
);
export const ReturnIcon = ({ size = 44 }) => (
  <svg {...base(size, { viewBox: "0 0 48 48", strokeWidth: 1.4 })}>
    <path d="M8 24a16 16 0 0 1 28-10.5" />
    <path d="M37 5v9h-9" />
    <path d="M40 24a16 16 0 0 1-28 10.5" />
    <text x="24" y="25" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif">24</text>
    <text x="24" y="34" textAnchor="middle" fontSize="7" fontWeight="600" fill="currentColor" stroke="none" fontFamily="Inter, sans-serif">HRS</text>
  </svg>
);
export const BoxIcon = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.78 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
    <path d="M2.32 6.16L12 11l9.68-4.84M12 22.76V11" />
  </svg>
);
export const ChatIcon = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    <path d="M8.5 12h.01M12 12h.01M15.5 12h.01" strokeWidth="2.2" />
  </svg>
);
export const DocIcon = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
  </svg>
);
export const TruckSmall = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M1 3h15v13H1z" />
    <path d="M16 8h4l3 3v5h-7z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
export const RotateIcon = ({ size = 26 }) => (
  <svg {...base(size)}>
    <path d="M1 4v6h6" />
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
  </svg>
);

/* ---- Brand bits ---- */
export const LogoMark = ({ size = 44, letter = "K" }) => {
  const dots = Array.from({ length: 16 }, (_, i) => {
    const a = (i * 2 * Math.PI) / 16;
    return { x: 32 + 24.5 * Math.cos(a), y: 32 + 24.5 * Math.sin(a) };
  });
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="29" strokeWidth="1.4" />
      <circle cx="32" cy="32" r="19" strokeWidth="1.4" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="1.5" fill="currentColor" stroke="none" />
      ))}
      <text x="32" y="41" textAnchor="middle" fontSize="26" fill="currentColor" stroke="none" fontFamily="'Playfair Display', Georgia, serif" fontWeight="600">
        {letter}
      </text>
    </svg>
  );
};

export const IndiaFlag = () => (
  <svg width="34" height="24" viewBox="0 0 34 24" aria-hidden="true">
    <rect width="34" height="8" fill="#FF9933" />
    <rect y="8" width="34" height="8" fill="#fff" />
    <rect y="16" width="34" height="8" fill="#138808" />
    <circle cx="17" cy="12" r="3" fill="none" stroke="#000080" strokeWidth="1" />
    <circle cx="17" cy="12" r=".8" fill="#000080" />
  </svg>
);

export const WhatsAppIcon = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path
      fill="currentColor"
      d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
    />
  </svg>
);