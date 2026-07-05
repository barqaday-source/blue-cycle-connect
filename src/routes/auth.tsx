import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, Loader2, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تدوير بلو — تسجيل الدخول" }] }),
  component: AuthPage,
});

type Lang = "ar" | "ku";
type Mode = "signin" | "signup";
type RoleChoice = "citizen" | "company";

const T = {
  ar: {
    ar: "العربية", ku: "کوردی",
    brand: "تدوير بلو",
    tagline: "أعد التدوير، اكسب، احمِ البيئة",
    signin: "دخول",
    signup: "حساب جديد",
    google: "متابعة عبر Google",
    or: "أو",
    email: "البريد الإلكتروني",
    password: "كلمة السر",
    name: "الاسم الكامل",
    company: "اسم الشركة",
    roleCitizen: "مواطن",
    roleCompany: "شركة",
    submitIn: "دخول",
    submitUp: "إنشاء حساب",
    emailBad: "بريد إلكتروني غير صالح",
    passBad: "كلمة السر يجب أن تكون 6 أحرف على الأقل",
    nameBad: "الرجاء إدخال الاسم الكامل",
    companyBad: "الرجاء إدخال اسم الشركة",
    signinFail: "بيانات الدخول غير صحيحة",
    welcome: "أهلاً بك في تدوير بلو",
    googleSoon: "تسجيل الدخول بجوجل قريباً",
  },
  ku: {
    ar: "العربية", ku: "کوردی",
    brand: "تەدویری بلو",
    tagline: "دووبارە بەکاربێنە، قازانج بکە، ژینگە بپارێزە",
    signin: "چوونەژوورەوە",
    signup: "هەژماری نوێ",
    google: "بەردەوامبوون بە Google",
    or: "یان",
    email: "ئیمەیڵ",
    password: "وشەی نهێنی",
    name: "ناوی تەواو",
    company: "ناوی کۆمپانیا",
    roleCitizen: "هاووڵاتی",
    roleCompany: "کۆمپانیا",
    submitIn: "چوونەژوورەوە",
    submitUp: "دروستکردنی هەژمار",
    emailBad: "ئیمەیڵ ڕاست نییە",
    passBad: "وشەی نهێنی دەبێت لانیکەم ٦ پیت بێت",
    nameBad: "تکایە ناوی تەواو بنووسە",
    companyBad: "تکایە ناوی کۆمپانیا بنووسە",
    signinFail: "زانیارییەکانی چوونەژوورەوە هەڵەیە",
    welcome: "بەخێربێیت بۆ تەدویری بلو",
    googleSoon: "چوونەژوورەوە بە گووگڵ بەم زووانە",
  },
};

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";

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
  const t = T[lang];

  async function afterAuth(userEmail: string | undefined, r: RoleChoice) {
    await refresh();
    toast.success(t.welcome);
    if (userEmail?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
    else if (r === "company") nav({ to: "/company" });
    else nav({ to: "/citizen" });
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
    <main dir="rtl" className="mx-auto min-h-screen w-full max-w-[460px] bg-white">
      {/* Blue hero */}
      <section className="relative rounded-b-[40px] px-6 pb-16 pt-6" style={{ backgroundColor: BLUE }}>
        {/* Language pill (top-start) */}
        <div className="inline-flex items-center gap-1 rounded-full bg-white/15 p-1 backdrop-blur">
          {(["ar", "ku"] as Lang[]).map((L) => (
            <button
              key={L}
              onClick={() => setLang(L)}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                lang === L ? "bg-white" : "text-white/95"
              }`}
              style={lang === L ? { color: BLUE } : undefined}
            >
              {L === "ar" ? t.ar : t.ku}
            </button>
          ))}
        </div>

        {/* Logo + brand */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div
            className="grid h-[104px] w-[104px] place-items-center rounded-[28px] bg-white"
            style={{ boxShadow: "0 18px 40px -14px rgba(0,0,0,0.28)" }}
          >
            <Recycle size={54} strokeWidth={2.2} style={{ color: BLUE }} />
          </div>
          <h1 className="mt-4 text-[34px] font-black leading-none tracking-tight text-white">{t.brand}</h1>
          <p className="mt-2 text-[13px] font-medium text-white/85">{t.tagline}</p>
        </div>
      </section>

      {/* Tabs overlapping the hero */}
      <section className="px-6">
        <div
          className="-mt-8 grid grid-cols-2 gap-1 rounded-full p-1"
          style={{ backgroundColor: SOFT, boxShadow: "0 10px 24px -12px rgba(30,99,255,0.35)" }}
        >
          {(["signin", "signup"] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="h-12 rounded-full text-[15px] font-extrabold transition"
                style={
                  active
                    ? { backgroundColor: BLUE, color: "#fff", boxShadow: "0 6px 16px -6px rgba(30,99,255,0.6)" }
                    : { color: `${BLUE}B3` }
                }
              >
                {m === "signin" ? t.signin : t.signup}
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {/* Google button */}
          <button
            onClick={() => toast.info(t.googleSoon)}
            className="flex h-[52px] w-full items-center justify-center gap-3 rounded-full border bg-white text-[15px] font-extrabold"
            style={{ borderColor: `${BLUE}33`, color: "#0D2A66" }}
          >
            <GoogleIcon />
            {t.google}
          </button>

          {/* أو divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1" style={{ backgroundColor: `${BLUE}33` }} />
            <span className="text-xs font-bold" style={{ color: `${BLUE}99` }}>{t.or}</span>
            <span className="h-px flex-1" style={{ backgroundColor: `${BLUE}33` }} />
          </div>

          {mode === "signup" && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <RoleCard active={role === "citizen"} onClick={() => setRole("citizen")} icon={<User size={16} />} label={t.roleCitizen} />
                <RoleCard active={role === "company"} onClick={() => setRole("company")} icon={<Building2 size={16} />} label={t.roleCompany} />
              </div>
              <Field label={t.name} icon={<User size={18} />} value={name} onChange={setName} />
              {role === "company" && (
                <Field label={t.company} icon={<Building2 size={18} />} value={company} onChange={setCompany} />
              )}
            </>
          )}

          <Field label={t.email} icon={<Mail size={18} />} value={email} onChange={setEmail} type="email" dir="ltr" placeholder="you@example.com" />
          <Field label={t.password} icon={<Lock size={18} />} value={password} onChange={setPassword} type="password" dir="ltr" placeholder="••••••" />

          <button
            onClick={submit}
            disabled={busy}
            className="mt-2 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-full text-[16px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
            style={{ backgroundColor: BLUE, boxShadow: "0 14px 30px -10px rgba(30,99,255,0.55)" }}
          >
            {busy && <Loader2 className="animate-spin" size={18} />}
            {mode === "signin" ? t.submitIn : t.submitUp}
          </button>

          <div className="h-8" />
        </div>
      </section>
    </main>
  );
}

function Field({
  icon, label, value, onChange, type = "text", dir, placeholder,
}: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void;
  type?: string; dir?: "ltr" | "rtl"; placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-2 text-[11px] font-bold" style={{ color: `${BLUE}B3` }}>{label}</span>
      <div className="flex h-[52px] items-center gap-3 rounded-full px-5" style={{ backgroundColor: SOFT }}>
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-[15px] font-bold outline-none"
          style={{ color: "#0D2A66" }}
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
      className="flex h-12 items-center justify-center gap-2 rounded-full text-sm font-extrabold transition"
      style={
        active
          ? { backgroundColor: BLUE, color: "#fff", boxShadow: "0 6px 16px -6px rgba(30,99,255,0.5)" }
          : { backgroundColor: SOFT, color: BLUE }
      }
    >
      {icon}
      {label}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.3-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.4 0-9.9-3.4-11.4-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6.3 5.3C41.4 34.9 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
