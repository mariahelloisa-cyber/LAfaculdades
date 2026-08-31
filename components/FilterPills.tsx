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
            className={`shrink-0 rounded-full px-6 py-3 text-[15px] font-bold transition-colors ${
              active
                ? "bg-rose text-white"
                : dark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-surface text-navy-950 hover:bg-tint"
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
