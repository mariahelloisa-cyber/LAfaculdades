"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="w-full max-w-[400px]">
      <h1 className="text-[2.5rem] font-extrabold leading-tight tracking-tight text-navy-950">Entrar</h1>
      <p className="mt-2.5 text-[15px] text-muted">
        Acesse o painel para gerenciar o conteúdo do site.
      </p>

      <div className="mt-9 space-y-5">
        <div>
          <label htmlFor="email" className="text-sm font-semibold text-navy-950">
            E-mail <span className="text-rose-dark">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="voce@lafaculdade.com.br"
            required
            className="mt-2 w-full rounded-xl border border-navy-950/15 px-4 py-3.5 text-[15px] text-navy-950 outline-none transition-colors placeholder:text-muted/60 focus:border-accent"
          />
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-semibold text-navy-950">
            Senha <span className="text-rose-dark">*</span>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-xl border border-navy-950/15 px-4 py-3.5 text-[15px] text-navy-950 outline-none transition-colors focus:border-accent"
          />
        </div>
      </div>

      {state?.error && <p className="mt-4 text-sm font-semibold text-rose-dark">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-9 w-full rounded-full bg-accent py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
