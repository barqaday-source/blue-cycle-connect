import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, Loader2, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تدوير بلو — الدخول" }] }),
  component: AuthPage,
});

type Lang = "ar" | "ku";
type Mode = "signin" | "signup";
type RoleChoice = "citizen" | "company";

const T = {
  ar: {
    ar: "العربية", ku: "کوردی",
    brand: "تدوير بلو",
    tagline: "أعد التدوير • اكسب • احمِ البيئة",
    signin: "دخول", signup: "تسجيل",
    google: "متابعة عبر Google",
    or: "أو",
    email: "البريد", password: "كلمة السر",
    name: "الاسم", company: "اسم الشركة",
    roleCitizen: "مواطن", roleCompany: "شركة",
    submitIn: "دخول", submitUp: "إنشاء حساب",
    emailBad: "بريد غير صالح", passBad: "كلمة السر 6 أحرف على الأقل",
    nameBad: "أدخل الاسم", companyBad: "أدخل اسم الشركة",
    signinFail: "بيانات الدخول غير صحيحة",
    welcome: "أهلاً بك",
  },
  ku: {
    ar: "العربية", ku: "کوردی",
    brand: "تەدویری بلو",
    tagline: "دووبارە بەکاربێنە • قازانج بکە • ژینگە بپارێزە",
    signin: "چوونەژوورەوە", signup: "خۆتۆمارکردن",
    google: "بەردەوامبوون بە Google",
    or: "یان",
    email: "ئیمەیڵ", password: "وشەی نهێنی",
    name: "ناو", company: "ناوی کۆمپانیا",
    roleCitizen: "هاووڵاتی", roleCompany: "کۆمپانیا",
    submitIn: "چوونەژوورەوە", submitUp: "دروستکردن",
    emailBad: "ئیمەیڵ ڕاست نییە", passBad: "وشەی نهێنی ٦ پیت",
    nameBad: "ناو بنووسە", companyBad: "ناوی کۆمپانیا بنووسە",
    signinFail: "زانیارییەکان هەڵەیە",
    welcome: "بەخێربێیت",
  },
};

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function AuthPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [lang, setLang] = useState<Lang>("ar");
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [gbusy, setGbusy] = useState(false);
  const t = T[lang];

  async function afterAuth(userEmail: string | undefined, r: RoleChoice) {
    await refresh();
    toast.success(t.welcome);
    if (userEmail?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
    else if (r === "company") nav({ to: "/company" });
    else nav({ to: "/citizen" });
  }

  async function googleSignIn() {
    setGbusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        toast.error((result.error as Error).message || "تعذر الدخول عبر Google");
        return;
      }
      if (result.redirected) return;
      const { data } = await supabase.auth.getUser();
      const r = ((data.user?.user_metadata as { role?: RoleChoice })?.role) ?? "citizen";
      await afterAuth(data.user?.email ?? undefined, r);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setGbusy(false);
    }
  }

  async function submit() {
    const em = email.trim().toLowerCase();
    if (!em || !em.includes("@")) return toast.error(t.emailBad);
    if (password.length < 6) return toast.error(t.passBad);
    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: em, password });
        if (error) return toast.error(t.signinFail);
        const r = ((data.user?.user_metadata as { role?: RoleChoice })?.role) ?? "citizen";
        return afterAuth(data.user?.email, r);
      }
      if (!name.trim()) return toast.error(t.nameBad);
      if (role === "company" && !company.trim()) return toast.error(t.companyBad);
      const { data, error } = await supabase.auth.signUp({
        email: em, password,
        options: {
          emailRedirectTo: window.location.origin,
          data: { full_name: name.trim(), role, company_name: role === "company" ? company.trim() : null },
        },
      });
      if (error) return toast.error(error.message);
      let session = data.session;
      if (!session) {
        const retry = await supabase.auth.signInWithPassword({ email: em, password });
        if (retry.error) return toast.error(retry.error.message);
        session = retry.data.session;
      }
      await afterAuth(session?.user?.email, role);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main dir="rtl" className="relative mx-auto min-h-screen w-full max-w-[420px] overflow-hidden bg-white" style={{ fontFamily: "Cairo, system-ui" }}>
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}55, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}44, transparent)` }}
      />

      {/* Hero */}
      <section className="relative z-10 px-5 pb-6 pt-5">
        <div
          className="inline-flex items-center gap-1 rounded-2xl p-1"
          style={{ background: SOFT, border: `1px solid ${BLUE}1F` }}
        >
          {(["ar", "ku"] as Lang[]).map((L) => (
            <button
              key={L}
              onClick={() => setLang(L)}
              className="rounded-xl px-3 py-1 text-[11px] font-extrabold transition"
              style={lang === L ? { background: BLUE, color: "#fff" } : { color: `${BLUE}B3` }}
            >
              {L === "ar" ? t.ar : t.ku}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center gap-1">
          <div
            className="grid h-[84px] w-[84px] place-items-center rounded-[28px]"
            style={{
              background: "rgba(30,99,255,0.06)",
              border: "1px solid rgba(30,99,255,0.18)",
              backdropFilter: "blur(8px)",
            }}
          >
            <Recycle size={44} strokeWidth={2.2} style={{ color: BLUE }} />
          </div>
          <h1 className="mt-3 text-[26px] font-black leading-none" style={{ color: INK }}>{t.brand}</h1>
          <p className="mt-1 text-[12px] font-medium" style={{ color: `${INK}99` }}>{t.tagline}</p>
        </div>
      </section>

      {/* Card */}
      <section className="relative z-10 px-5 pb-10">
        <div
          className="rounded-[32px] p-4"
          style={{
            background: "rgba(255,255,255,0.72)",
            border: `1px solid ${BLUE}1F`,
            backdropFilter: "blur(14px)",
            boxShadow: "0 22px 50px -28px rgba(13,42,102,0.45)",
          }}
        >
          <div className="grid grid-cols-2 gap-1.5 rounded-3xl p-1.5"
               style={{ background: SOFT }}>
            {(["signin", "signup"] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="h-12 rounded-[22px] text-[13px] font-extrabold transition active:scale-[0.98]"
                  style={active ? { background: BLUE, color: "#fff", boxShadow: "0 12px 24px -14px rgba(30,99,255,0.7)" } : { color: `${BLUE}B3` }}
                >
                  {m === "signin" ? t.signin : t.signup}
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-col gap-4">
            <button
              onClick={googleSignIn}
              disabled={gbusy}
              className="flex h-[54px] w-full items-center justify-center gap-2 rounded-3xl text-[13px] font-extrabold transition active:scale-[0.98] disabled:opacity-60"
              style={{ background: "rgba(30,99,255,0.05)", border: `1px solid ${BLUE}29`, color: INK, backdropFilter: "blur(8px)" }}
            >
              {gbusy ? <Loader2 className="animate-spin" size={16} /> : <GoogleIcon />}
              {t.google}
            </button>

            <div className="flex items-center gap-3">
              <span className="h-px flex-1" style={{ background: `${BLUE}26` }} />
              <span className="text-[10px] font-bold" style={{ color: `${BLUE}99` }}>{t.or}</span>
              <span className="h-px flex-1" style={{ background: `${BLUE}26` }} />
            </div>

            {mode === "signup" && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <RoleCard active={role === "citizen"} onClick={() => setRole("citizen")} icon={<User size={14} />} label={t.roleCitizen} />
                  <RoleCard active={role === "company"} onClick={() => setRole("company")} icon={<Building2 size={14} />} label={t.roleCompany} />
                </div>
                <Field label={t.name} icon={<User size={16} />} value={name} onChange={setName} />
                {role === "company" && (
                  <Field label={t.company} icon={<Building2 size={16} />} value={company} onChange={setCompany} />
                )}
              </>
            )}

            <Field label={t.email} icon={<Mail size={16} />} value={email} onChange={setEmail} type="email" dir="ltr" placeholder="you@example.com" />
            <Field label={t.password} icon={<Lock size={16} />} value={password} onChange={setPassword} type="password" dir="ltr" placeholder="••••••" />

            <button
              onClick={submit}
              disabled={busy}
              className="mt-2 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-3xl text-[14px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
              style={{ background: BLUE, boxShadow: "0 18px 40px -14px rgba(30,99,255,0.55)" }}
            >
              {busy && <Loader2 className="animate-spin" size={16} />}
              {mode === "signin" ? t.submitIn : t.submitUp}
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

function Field({ icon, label, value, onChange, type = "text", dir, placeholder }: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void;
  type?: string; dir?: "ltr" | "rtl"; placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="px-1 text-[10px] font-bold" style={{ color: `${BLUE}B3` }}>{label}</span>
      <div className="flex h-[52px] items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[13px] font-bold outline-none"
          style={{ color: INK }}
        />
        <span style={{ color: `${BLUE}B3` }}>{icon}</span>
      </div>
    </label>
  );
}

function RoleCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-1.5 rounded-3xl text-[12px] font-extrabold transition active:scale-[0.98]"
      style={active ? { background: BLUE, color: "#fff" } : { background: SOFT, color: BLUE }}
    >
      {icon}{label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.4 0-9.9-3.4-11.4-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6.3 5.3C41.4 34.9 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
