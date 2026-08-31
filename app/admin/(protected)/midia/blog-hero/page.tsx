import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "../../AdminUI";
import MidiaSlot from "../MidiaSlot";

export default async function HeroBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("site_media").select("url").eq("chave", "blog_hero").maybeSingle();

  return (
    <div>
      <PageHeader
        icon="imagem"
        title="Hero do Blog"
        description="Imagem de fundo do topo da página /blog."
      />
      <MidiaSlot
        chave="blog_hero"
        tipo="imagem"
        url={(data?.url as string) ?? ""}
        dica="Use uma imagem larga (ex.: 1920x800). O site escurece a foto automaticamente para o texto continuar legível."
      />
    </div>
  );
}
