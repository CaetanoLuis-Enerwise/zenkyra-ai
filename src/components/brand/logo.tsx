import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  withWordmark?: boolean;
  size?: number;
}

export function Logo({ className, withWordmark = true, size = 28 }: LogoProps) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span
        className="relative inline-flex items-center justify-center rounded-md text-white"
        style={{
          width: size,
          height: size,
          background:
            "linear-gradient(135deg, #6F94FF 0%, #4F7DFF 60%, #2F5FE6 100%)",
          boxShadow: "0 4px 16px -4px rgba(79,125,255,0.6)",
        }}
        aria-hidden
      >
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 2L4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4z"
            stroke="white"
            strokeWidth="1.8"
            strokeLinejoin="round"
            opacity="0.95"
          />
          <path
            d="M9 12l2 2 4-4"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {withWordmark && (
        <span className="text-[15px] font-semibold tracking-tight">
          Zenkyra<span className="text-brand"> AI</span>
        </span>
      )}
    </div>
  );
}
