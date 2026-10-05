"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/admin";
import { MIDIA_INVALIDA, midiaValida } from "@/lib/mediaUrl";
import { SITE_MEDIA_KEYS, type SiteMediaKey } from "@/lib/data/siteMedia";

export type MidiaFormState = { error?: string; ok?: string } | undefined;

function ehChaveDeMidia(chave: string): chave is SiteMediaKey {
  return (SITE_MEDIA_KEYS as readonly string[]).includes(chave);
}

export async function updateSiteMedia(
  chave: string,
  tipo: "imagem" | "video",
  _prevState: MidiaFormState,
  formData: FormData
): Promise<MidiaFormState> {
  const { supabase } = await requireAdmin();

  // O arquivo já foi enviado ao Storage pelo navegador (UploadField);
  // aqui só chega a URL pública.
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return { error: "Escolha um arquivo antes de salvar." };

  /* chave e tipo vêm do .bind() no cliente — argumentos que o navegador
     consegue trocar. Só os slots que o site conhece e uma URL do bucket. */
  if (!ehChaveDeMidia(chave) || (tipo !== "imagem" && tipo !== "video")) {
    return { error: "Slot de mídia inválido." };
  }
  if (!midiaValida(url)) return { error: MIDIA_INVALIDA };

  // upsert: slots novos funcionam mesmo em bancos onde a linha ainda não existe.
  const { error } = await supabase
    .from("site_media")
    .upsert({ chave, tipo, url, updated_at: new Date().toISOString() }, { onConflict: "chave" });

  if (error) return { error: "Erro ao salvar a mídia." };

  revalidatePath("/", "layout");
  revalidatePath("/admin/midia");
  return { ok: "Mídia atualizada." };
}

export async function clearSiteMedia(formData: FormData) {
  const { supabase } = await requireAdmin();

  const chave = String(formData.get("chave") ?? "");
  if (!ehChaveDeMidia(chave)) return;

  await supabase.from("site_media").update({ url: "" }).eq("chave", chave);

  revalidatePath("/", "layout");
  revalidatePath("/admin/midia");
}
