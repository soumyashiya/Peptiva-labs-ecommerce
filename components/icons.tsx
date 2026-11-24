import type { SVGProps } from "react";

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function PlanIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="4" y="5" width="16" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M4 11h16" />
      <path d="M9 15l2 2 4-4" />
    </svg>
  );
}

export function HeartPulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 20s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 1.7-.7 3.3-1.7 4.6" />
      <path d="M4 14h3l1.5-3L11 17l1.5-4 1.5 1.5h4" />
    </svg>
  );
}

export function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 19c0-8 5-13 14-13 0 9-5 14-13 14a4 4 0 0 1-1-1z" />
      <path d="M5 19c5-3 8-7 10-12" />
    </svg>
  );
}

export function DumbbellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 9v6M6 7v10M18 7v10M21 9v6" />
      <path d="M6 12h12" />
    </svg>
  );
}

export function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l1.6 5.2L19 10l-5.4 1.8L12 17l-1.6-5.2L5 10l5.4-1.8L12 3z" />
    </svg>
  );
}

export function CoachIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1-3.5 4-5.5 7.5-5.5s6.5 2 7.5 5.5" />
    </svg>
  );
}

export function ChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 20V8M10 20v-6M16 20V4M22 20H2" />
    </svg>
  );
}

export function ClockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

export function QuoteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M9.5 6C6.5 7.3 5 9.7 5 13.2V18h5v-5H7.6c.1-1.8.9-3 2.4-3.6L9.5 6zm9 0c-3 1.3-4.5 3.7-4.5 7.2V18h5v-5h-2.4c.1-1.8.9-3 2.4-3.6L18.5 6z" />
    </svg>
  );
}

export function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function BeakerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5 8.5A2 2 0 0 0 6.7 21h10.6a2 2 0 0 0 1.7-3.5L14 9V3" />
      <path d="M7 15h10" />
    </svg>
  );
}

export function DotIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width={8}
      height={8}
      viewBox="0 0 8 8"
      className={className}
      aria-hidden
    >
      <circle cx="4" cy="4" r="3" fill="currentColor" />
    </svg>
  );
}

export function PenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3h6" />
      <path d="M10 3v12a3 3 0 0 0 6 0V3" />
      <path d="M10 9h6" />
    </svg>
  );
}

export function LockIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2.5" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export function DocIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3.5h7l3 3V20a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M14 3.5V7h3" />
      <path d="M8.5 12h7M8.5 15.5h7M8.5 8.5h3" />
    </svg>
  );
}

export function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5.5" width="17" height="13" rx="2.5" />
      <path d="M4.5 7l7.5 6 7.5-6" />
    </svg>
  );
}

export function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export function ShieldIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function TruckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h11v9H3z" />
      <path d="M14 10h4l3 3v3h-7" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function ChatIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5h16v11H8l-4 4V5z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}

export function CartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M3 4h2l2.2 11.2a1.5 1.5 0 0 0 1.5 1.2h8.1a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
      <circle cx="9.5" cy="20" r="1.3" />
      <circle cx="17.5" cy="20" r="1.3" />
    </svg>
  );
}

export function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MinusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </svg>
  );
}

export function ArrowLeft(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={16} height={16} {...props}>
      <path d="M19 12H5" />
      <path d="M11 6l-6 6 6 6" />
    </svg>
  );
}

export function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M15.8 15.8 20 20" />
    </svg>
  );
}

export function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6" />
    </svg>
  );
}

export function ChevronRightIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function ArrowRightLong(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} width={20} height={20} {...props}>
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Filled star used by every rating row. Fractional fills are handled by
 * clipping the glyph to `fill`% of its width, matching how the reference
 * renders half stars.
 */
export function StarIcon({
  fill = 1,
  size = 16,
  className = "",
}: {
  fill?: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  const path =
    "M12 2.4l2.9 5.9 6.5.95-4.7 4.58 1.1 6.47L12 17.25 6.2 20.3l1.1-6.47L2.6 9.25l6.5-.95L12 2.4z";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden
    >
      <path d={path} fill="currentColor" opacity={0.18} />
      {pct > 0 && (
        <path
          d={path}
          fill="currentColor"
          style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
        />
      )}
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.5l4.5 4.5L19 7" />
    </svg>
  );
}

export function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.3l2.4 2.4 4.6-4.9" />
    </svg>
  );
}

export function TagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <path d="M11.6 3.5H20v8.4l-8.7 8.7a1.6 1.6 0 0 1-2.3 0l-6.1-6.1a1.6 1.6 0 0 1 0-2.3l8.7-8.7z" />
      <circle cx="16.3" cy="7.7" r="1.3" />
    </svg>
  );
}

export function CalendarCheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <path d="M8 2.8v4.4M16 2.8v4.4M3.5 10.5h17" />
      <path d="M9.3 15.2l1.9 1.9 3.6-3.8" />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.2 9.3H3.4V21h2.8V9.3zM4.8 3a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM21 14.2c0-3.2-1.7-4.7-4-4.7-1.8 0-2.7 1-3.1 1.7V9.3H11V21h2.9v-6.5c0-1.4.6-2.3 1.9-2.3s1.8.9 1.8 2.3V21H21v-6.8z" />
    </svg>
  );
}

/**
 * Wordmark lockup. The reference leads with a plain lowercase wordmark and no
 * icon, so the mark carries the brand through weight and tracking alone.
 */
export function Logo({
  className = "",
  invert = false,
}: {
  className?: string;
  invert?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-baseline gap-[3px] text-[22px] font-bold leading-none tracking-[-0.03em] ${
        invert ? "text-white" : "text-black"
      } ${className}`}
    >
      Peptiva
      <span className="font-normal">Labs</span>
      <span
        aria-hidden
        className={`translate-y-[-7px] text-[9px] font-normal ${
          invert ? "text-white/60" : "text-grey-600"
        }`}
      >
        ®
      </span>
    </span>
  );
}
