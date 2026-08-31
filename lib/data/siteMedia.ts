import { supabasePublic } from "@/lib/supabase/publicClient";

export type SiteMediaKey = "blog_hero" | "home_hero_video";

export async function getSiteMediaUrl(chave: SiteMediaKey): Promise<string> {
  const { data, error } = await supabasePublic
    .from("site_media")
    .select("url")
    .eq("chave", chave)
    .maybeSingle();

  if (error || !data?.url) return "";
  return data.url;
}
