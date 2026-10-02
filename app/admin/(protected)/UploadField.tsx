"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

const EXTENSOES: Record<"imagem" | "video", Record<string, string>> = {
  imagem: {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "image/avif": "avif",
  },
  video: {
    "video/mp4": "mp4",
    "video/webm": "webm",
    "video/quicktime": "mov",
  },
};

/**
 * Envia o arquivo direto do navegador para o Storage do Supabase e guarda
 * só a URL num input escondido. É assim (e não via Server Action) porque
 * Server Action tem limite de 1 MB de corpo — qualquer vídeo ou foto de
 * celular estoura isso.
 */
export default function UploadField({
  name,
  folder,
  tipo,
  currentUrl,
  label,
  hint,
  previewAspect = "aspect-[16/7]",
  onUploadingChange,
}: {
  /** nome do campo que vai levar a URL no submit do formulário */
  name: string;
  /** pasta dentro do bucket "media" */
  folder: string;
  tipo: "imagem" | "video";
  currentUrl?: string;
  label: string;
  hint?: string;
  /** classe de proporção da prévia (ex.: "aspect-square") */
  previewAspect?: string;
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [url, setUrl] = useState(currentUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function setBusy(v: boolean) {
    setUploading(v);
    onUploadingChange?.(v);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setErro(null);

    /* A extensão sai do tipo do arquivo, não do nome: "foto.html" com tipo
       image/png vira .png. O bucket recusa o que não estiver nesta lista
       (supabase/schema.sql) — aqui é só para avisar antes de enviar. */
    const ext = EXTENSOES[tipo][file.type];
    if (!ext) {
      setErro(
        tipo === "imagem"
          ? "Formato não aceito. Envie JPG, PNG, WebP, GIF ou AVIF."
          : "Formato não aceito. Envie MP4, WebM ou MOV."
      );
      e.target.value = "";
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();
      const path = `${folder}/${crypto.randomUUID()}.${ext}`;

      /* cacheControl de 1 ano: o caminho é um UUID novo a cada envio e nunca é
         sobrescrito (upsert: false), então o arquivo nesta URL jamais muda —
         trocar a mídia no painel gera outra URL. Sem isto o Supabase manda o
         padrão de 1 hora, e quem volta ao site baixa o vídeo da home de novo. */
      const { error } = await supabase.storage.from("media").upload(path, file, {
        upsert: false,
        contentType: file.type,
        cacheControl: "31536000",
      });

      if (error) {
        setErro(`Não foi possível enviar: ${error.message}`);
        return;
      }

      const { data } = supabase.storage.from("media").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch {
      setErro("Não foi possível enviar o arquivo. Tente de novo.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-semibold text-navy-950">{label}</label>

      <input type="hidden" name={name} value={url} />

      {url && (
        <div className="mt-2 overflow-hidden rounded-xl bg-surface">
          {tipo === "imagem" ? (
            <div className={`relative ${previewAspect} w-full`}>
              <Image src={url} alt="" fill className="object-cover" />
            </div>
          ) : (
            <video src={url} controls muted className={`${previewAspect} w-full bg-navy-950 object-cover`} />
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={Object.keys(EXTENSOES[tipo]).join(",")}
        onChange={handleFile}
        disabled={uploading}
        className="mt-2 block w-full text-sm text-navy-950 file:mr-4 file:rounded-full file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-accent-hover disabled:opacity-60"
      />

      {uploading && <p className="mt-2 text-sm font-semibold text-accent">Enviando arquivo...</p>}
      {erro && <p className="mt-2 text-sm font-semibold text-rose-dark">{erro}</p>}
      {hint && !uploading && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}
