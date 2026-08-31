import { SITE } from "@/lib/constants";

const badges = [
  { title: `E-MEC ${SITE.emec}`, subtitle: "Credenciada pelo MEC" },
  { title: "RA 1000", subtitle: "Certificado ReclameAQUI" },
  { title: "5,0 ★★★★★", subtitle: "Avaliação no Google" },
  { title: "100% EAD", subtitle: "Estude de onde estiver" },
];

export default function TrustBadges({ dark = false }: { dark?: boolean }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {badges.map((b) => (
        <div
          key={b.title}
          className={`rounded-2xl px-5 py-6 text-center ${dark ? "bg-white/10" : "bg-surface"}`}
        >
          <span className={`block font-display text-xl font-extrabold ${dark ? "text-white" : "text-navy-950"}`}>
            {b.title}
          </span>
          <span className={`mt-1.5 block text-[12px] font-bold ${dark ? "text-sky-300" : "text-muted"}`}>
            {b.subtitle}
          </span>
        </div>
      ))}
    </div>
  );
}
