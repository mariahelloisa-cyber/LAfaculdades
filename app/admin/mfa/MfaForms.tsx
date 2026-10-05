"use client";

import { useActionState, useEffect, useState, useTransition } from "react";
import { logout } from "../(protected)/actions";
import { confirmarCadastro, iniciarCadastro, verificarCodigo, type CadastroMfa } from "./actions";

const campoClasse =
  "mt-2 w-full rounded-xl border border-navy-950/15 px-4 py-3.5 text-center text-[22px] font-bold tracking-[0.4em] text-navy-950 outline-none transition-colors focus:border-accent";
const botaoClasse =
  "w-full rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60";

/* Código aceito: navegação completa, como no login — o proxy e o layout leem
   o cookie novo (aal2). */
function useEntrarQuandoOk(ok: boolean | undefined) {
  useEffect(() => {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    if (ok) window.location.assign("/admin");
  }, [ok]);
}

function CampoCodigo() {
  return (
    <div>
      <label htmlFor="codigo" className="text-sm font-semibold text-navy-950">
        Código de 6 dígitos <span className="text-rose-dark">*</span>
      </label>
      <input
        id="codigo"
        name="codigo"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        pattern="[0-9 ]{6,7}"
        maxLength={7}
        required
        autoFocus
        className={campoClasse}
      />
    </div>
  );
}

function Sair() {
  return (
    <form action={logout} className="mt-6 text-center">
      <button type="submit" className="text-sm font-semibold text-muted underline underline-offset-4 hover:text-navy-950">
        Sair e voltar ao login
      </button>
    </form>
  );
}

export function VerificarMfaForm() {
  const [state, formAction, pending] = useActionState(verificarCodigo, undefined);
  const entrando = pending || state?.ok === true;
  useEntrarQuandoOk(state?.ok);

  return (
    <div className="w-full max-w-[400px]">
      <h1 className="text-[2.25rem] font-extrabold leading-tight tracking-tight text-navy-950">Verificação em duas etapas</h1>
      <p className="mt-2.5 text-[15px] text-muted">Abra o app autenticador e digite o código da LA Faculdades.</p>

      <form action={formAction} className="mt-8 space-y-5">
        <CampoCodigo />
        {state?.error && <p className="text-sm font-semibold text-rose-dark">{state.error}</p>}
        <button type="submit" disabled={entrando} className={botaoClasse}>
          {entrando ? "Verificando..." : "Confirmar"}
        </button>
      </form>
      <Sair />
    </div>
  );
}

export function CadastrarMfa() {
  const [cadastro, setCadastro] = useState<CadastroMfa | null>(null);
  const [gerando, startGerar] = useTransition();
  const [state, formAction, pending] = useActionState(confirmarCadastro, undefined);
  const entrando = pending || state?.ok === true;
  useEntrarQuandoOk(state?.ok);

  const gerar = () => startGerar(async () => setCadastro(await iniciarCadastro()));
  const pronto = cadastro && !("error" in cadastro) ? cadastro : null;

  return (
    <div className="w-full max-w-[440px]">
      <h1 className="text-[2.25rem] font-extrabold leading-tight tracking-tight text-navy-950">Ative a verificação em duas etapas</h1>
      <p className="mt-2.5 text-[15px] text-muted">
        O painel guarda dados pessoais de candidatos, então a senha sozinha não basta. Instale um app autenticador
        (Google Authenticator, Microsoft Authenticator, 1Password...) no celular para continuar.
      </p>

      {!pronto ? (
        <div className="mt-8">
          {cadastro && "error" in cadastro && (
            <p className="mb-4 text-sm font-semibold text-rose-dark">{cadastro.error}</p>
          )}
          <button type="button" onClick={gerar} disabled={gerando} className={botaoClasse}>
            {gerando ? "Gerando..." : "Gerar QR Code"}
          </button>
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-5">
          <input type="hidden" name="factor_id" value={pronto.factorId} />
          <div className="flex flex-col items-center rounded-2xl bg-surface p-5">
            {/* data: URI de SVG gerado pelo Supabase; em <img> o SVG não executa script. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pronto.qrCode} alt="QR Code para o app autenticador" width={200} height={200} className="rounded-lg bg-white p-2" />
            <p className="mt-4 text-center text-[13px] text-muted">Sem câmera? Digite esta chave no app:</p>
            <code className="mt-1 break-all text-center text-[13px] font-bold text-navy-950">{pronto.segredo}</code>
          </div>
          <CampoCodigo />
          {state?.error && <p className="text-sm font-semibold text-rose-dark">{state.error}</p>}
          <button type="submit" disabled={entrando} className={botaoClasse}>
            {entrando ? "Ativando..." : "Ativar e entrar"}
          </button>
        </form>
      )}
      <Sair />
    </div>
  );
}
