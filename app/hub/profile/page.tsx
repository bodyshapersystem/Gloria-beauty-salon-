"use client";

import { useEffect, useState } from "react";
import { KeyRound, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

const roleLabels: Record<string, string> = { owner: "Dueña", admin: "Administradora", staff: "Staff" };

export default function HubProfilePage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string | null>(null);

  const [newEmail, setNewEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email || "");
        setNewEmail(user.email || "");
        const { data } = await supabase
          .from("user_profiles")
          .select("role")
          .eq("auth_user_id", user.id)
          .maybeSingle();
        setRole(data?.role || null);
      }
    })();
  }, []);

  async function saveEmail() {
    setEmailMessage(null);
    setEmailError(null);
    if (!newEmail.trim() || newEmail.trim() === email) return;
    setEmailSaving(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setEmailSaving(false);
    if (error) {
      setEmailError("No pudimos actualizar el email. Inténtalo de nuevo.");
      return;
    }
    setEmailMessage(
      "Revisa tu correo actual y el nuevo — Supabase envía un enlace de confirmación a ambos antes de completar el cambio."
    );
  }

  async function savePassword() {
    setPasswordMessage(null);
    setPasswordError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Completa los 3 campos.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("La nueva contraseña y su confirmación no coinciden.");
      return;
    }
    setPasswordSaving(true);

    // Re-verify the current password before allowing the change.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });
    if (reauthError) {
      setPasswordSaving(false);
      setPasswordError("Tu contraseña actual no es correcta.");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordSaving(false);
    if (error) {
      setPasswordError("No pudimos actualizar la contraseña. Inténtalo de nuevo.");
      return;
    }
    setPasswordMessage("Contraseña actualizada correctamente.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  return (
    <div className="max-w-[640px]">
      <p className="text-[10px] uppercase tracking-[0.28em] text-mocha">Gloria Hub</p>
      <h1 className="mt-2 font-serif text-[46px] md:text-[58px] leading-none">Mi Perfil</h1>
      <p className="mt-3 text-[13px] text-taupe">Tu cuenta de acceso al Hub — email, contraseña y rol.</p>

      <div className="mt-7 flex items-center gap-3 rounded-[20px] border border-champagne/30 bg-white/45 p-5">
        <ShieldCheck size={20} className="text-mocha" />
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-taupe">Rol actual</p>
          <p className="mt-1 font-serif text-[22px] leading-none">{role ? roleLabels[role] || role : "—"}</p>
        </div>
      </div>

      <section className="mt-7 rounded-[24px] border border-champagne/30 bg-white/40 p-6">
        <div className="flex items-center gap-2 text-mocha">
          <Mail size={16} />
          <p className="text-[9px] uppercase tracking-[0.2em]">Correo de acceso</p>
        </div>
        <p className="mt-2 text-[12px] text-taupe">Correo actual: {email}</p>
        <label className="mt-4 block">
          <span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Nuevo correo</span>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-3 text-[13px] outline-none"
          />
        </label>
        {emailError && <p className="mt-3 text-[12px] text-red-700">{emailError}</p>}
        {emailMessage && <p className="mt-3 text-[12px] text-mocha">{emailMessage}</p>}
        <button
          onClick={saveEmail}
          disabled={emailSaving || !newEmail.trim() || newEmail.trim() === email}
          className="mt-5 rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory disabled:opacity-40"
        >
          {emailSaving ? "Guardando..." : "Actualizar correo"}
        </button>
      </section>

      <section className="mt-6 rounded-[24px] border border-champagne/30 bg-white/40 p-6">
        <div className="flex items-center gap-2 text-mocha">
          <KeyRound size={16} />
          <p className="text-[9px] uppercase tracking-[0.2em]">Contraseña</p>
        </div>
        <div className="mt-4 grid gap-4">
          <label className="block">
            <span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Contraseña actual</span>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-3 text-[13px] outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Nueva contraseña</span>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-3 text-[13px] outline-none"
            />
          </label>
          <label className="block">
            <span className="block text-[9px] uppercase tracking-[0.14em] text-taupe">Confirmar nueva contraseña</span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-2 w-full rounded-xl border border-taupe/25 bg-ivory px-3 py-3 text-[13px] outline-none"
            />
          </label>
        </div>
        {passwordError && <p className="mt-3 text-[12px] text-red-700">{passwordError}</p>}
        {passwordMessage && <p className="mt-3 text-[12px] text-mocha">{passwordMessage}</p>}
        <button
          onClick={savePassword}
          disabled={passwordSaving}
          className="mt-5 rounded-full bg-espresso px-5 py-3 text-[9px] uppercase tracking-[0.14em] text-ivory disabled:opacity-40"
        >
          {passwordSaving ? "Guardando..." : "Actualizar contraseña"}
        </button>
      </section>
    </div>
  );
}
