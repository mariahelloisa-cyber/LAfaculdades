"use client";

export default function FilterPills({
  options,
  value,
  onChange,
  dark = false,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  dark?: boolean;
}) {
  return (
    <div className="-mx-[var(--gutter)] flex gap-2.5 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            aria-pressed={active}
            className={`flex h-10 shrink-0 items-center rounded-full px-5 text-sm font-bold transition-colors ${
              active
                ? "bg-[#F23883] text-white"
                : dark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-[#f1f1f1] text-[#111] hover:bg-tint"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
