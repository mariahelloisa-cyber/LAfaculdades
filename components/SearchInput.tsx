"use client";

export default function SearchInput({
  value,
  onChange,
  placeholder = "Procure o curso ideal pra você!",
  label = "Buscar curso",
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}) {
  return (
    <label className={`relative block w-full shrink-0 sm:w-[380px] ${className}`}>
      <span className="sr-only">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-[55px] w-full rounded-[30px] border border-black bg-white pl-6 pr-14 text-[15px] font-semibold text-black outline-none transition-colors placeholder:text-black/55 focus:border-accent"
      />
      <svg
        width="19"
        height="19"
        viewBox="0 0 24 24"
        fill="none"
        className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-black"
        aria-hidden
      >
        <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2.2" />
        <path d="m16.5 16.5 4 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </label>
  );
}
