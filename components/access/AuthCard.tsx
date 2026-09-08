"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/lib/supabase/client";

type Mode = "login" | "create";

const SITE_URL = "https://www.gloriabeautysalonmiami.com";

export function AuthCard({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const invitedEmail = params.get("email");
    if (mode === "create" && invitedEmail) setEmail(invitedEmail);
  }, [mode, params]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === "login") {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (authError) {
        setError("No pudimos iniciar sesión. Revisa tu email y contraseña.");
        return;
      }
      router.replace("/access");
      router.refresh();
      return;
    }

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: `${SITE_URL}/access`,
        data: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          birthday: birthday || null,
        },
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message.includes("already registered") ? "Este email ya tiene Gloria Access. Inicia sesión." : "No pudimos crear tu cuenta. Inténtalo nuevamente.");
      return;
    }

    if (data.session) {
      router.replace("/access");
      router.refresh();
      return;
    }

    // This only happens while Supabase email confirmations are enabled.
    // Production is intended to run with email confirmations disabled so
    // clients enter Access immediately after creating their account.
    setMessage("Tu cuenta fue creada. Estamos terminando de activar el acceso directo; intenta iniciar sesión en unos segundos.");
  }

  return (
    <div className="min-h-screen px-5 py-10 md:py-16 flex items-center justify-center bg-[radial-gradient(circle_at_top_right,rgba(234,214,209,0.55),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(212,184,150,0.18),transparent_30%)]">
      <div className="w-full max-w-[520px] rounded-[28px] border border-champagne/35 bg-white/55 backdrop-blur-sm px-6 py-8 md:px-10 md:py-10 shadow-[0_20px_70px_rgba(46,39,36,0.08)]">
        <Link href="/" aria-label="Volver a Gloria Beauty Salon"><Logo className="h-[78px] w-auto mx-auto" /></Link>
        <div className="mt-6 text-center">
          <p className="text-[10px] uppercase tracking-[0.34em] text-mocha">Gloria Access</p>
          <h1 className="mt-3 font-serif text-[36px] md:text-[42px] leading-[0.95]">{mode === "login" ? "Welcome back" : "Create your beauty space"}</h1>
          <p className="mt-4 text-[13px] leading-relaxed text-taupe">{mode === "login" ? "Tus citas, tu beauty history y tus recomendaciones en un solo lugar." : "Crea tu cuenta y entra directo a tus citas, tu Beauty Profile y toda tu experiencia Gloria."}</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          {mode === "create" && (
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nombre" value={firstName} onChange={setFirstName} required />
              <Field label="Apellido" value={lastName} onChange={setLastName} required />
            </div>
          )}
          <Field label="Email" value={email} onChange={setEmail} type="email" required />
          {mode === "create" && <Field label="Teléfono" value={phone} onChange={setPhone} type="tel" required />}
          {mode === "create" && <Field label="Cumpleaños · opcional" value={birthday} onChange={setBirthday} type="date" />}
          <Field label="Contraseña" value={password} onChange={setPassword} type="password" required minLength={8} />

          {error && <p className="rounded-xl bg-blush/45 px-4 py-3 text-[12px] text-mocha">{error}</p>}
          {message && <p className="rounded-xl bg-champagne/20 px-4 py-3 text-[12px] text-mocha">{message}</p>}

          <button disabled={loading} className="w-full min-h-[56px] rounded-full bg-espresso text-ivory text-[11px] font-semibold uppercase tracking-[0.2em] disabled:opacity-50">
            {loading ? "Procesando..." : mode === "login" ? "Enter Gloria Access" : "Crear y entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-[12px] text-taupe">
          {mode === "login" ? <>¿Aún no tienes cuenta? <Link href="/access/create-account" className="text-mocha underline underline-offset-4">Create Account</Link></> : <>¿Ya tienes Gloria Access? <Link href="/access/login" className="text-mocha underline underline-offset-4">Login</Link></>}
        </div>
        <div className="mt-8 border-t border-champagne/30 pt-5 text-center">
          <Link href="/reservar" className="text-[10px] uppercase tracking-[0.2em] text-mocha">Reservar sin crear cuenta →</Link>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, minLength }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; minLength?: number }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-taupe">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} minLength={minLength} className="w-full rounded-xl border border-taupe/25 bg-ivory/65 px-4 py-3.5 text-[14px] outline-none focus:border-mocha/55" />
    </label>
  );
}
