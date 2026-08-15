import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Lock, User, Building2, Loader2, Eye, EyeOff, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "تدوير بلو — تسجيل الدخول" },
      { name: "description", content: "دخول سريع إلى تدوير بلو عبر Google أو بالبريد وكلمة السر، بدون رسائل تأكيد." },
      { property: "og:title", content: "تدوير بلو — تسجيل الدخول" },
      { property: "og:description", content: "دخول سريع إلى منصة تدوير بلو لإدارة وبيع المواد القابلة للتدوير." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

type Lang = "ar" | "ku";
type Mode = "signin" | "signup";
type RoleChoice = "citizen" | "collector" | "company";

const T = {
  ar: {
    switch: "کوردی",
    brand: "تدوير بلو",
    tagline: "أعد التدوير واكسب",
    signin: "دخول",
    signup: "حساب جديد",
    google: "متابعة عبر Google",
    or: "أو",
    email: "البريد الإلكتروني",
    password: "كلمة السر",
    name: "الاسم الكامل",
    company: "اسم الشركة",
    accountType: "نوع الحساب",
    citizen: "مواطن",
    collector: "مجمع",
    company_: "شركة",
    submitIn: "دخول",
    submitUp: "إنشاء حساب",
    emailBad: "أدخل بريداً صحيحاً",
    passBad: "كلمة السر 6 أحرف على الأقل",
    nameBad: "أدخل الاسم الكامل",
    companyBad: "أدخل اسم الشركة",
    signinFail: "البريد أو كلمة السر غير صحيحة",
    welcome: "أهلاً بك",
    note: "دخول فوري بدون رسائل تأكيد",
    googleFail: "تعذر الدخول عبر Google",
    show: "إظهار",
    hide: "إخفاء",

  },
  ku: {
    switch: "العربية",
    brand: "تەدویری بلو",
    tagline: "دووبارە بەکاربێنە و قازانج بکە",
    signin: "چوونەژوورەوە",
    signup: "ئاکاونتی نوێ",
    google: "بەردەوامبوون بە Google",
    or: "یان",
    email: "ئیمەیڵ",
    password: "وشەی نهێنی",
    name: "ناوی تەواو",
    company: "ناوی کۆمپانیا",
    accountType: "جۆری ئاکاونت",
    citizen: "هاووڵاتی",
    collector: "کۆکەر",
    company_: "کۆمپانیا",
    submitIn: "چوونەژوورەوە",
    submitUp: "دروستکردن",
    emailBad: "ئیمەیڵی دروست بنووسە",
    passBad: "وشەی نهێنی ٦ پیت بێت",
    nameBad: "ناوی تەواو بنووسە",
    companyBad: "ناوی کۆمپانیا بنووسە",
    signinFail: "زانیارییەکان هەڵەیە",
    welcome: "بەخێربێیت",
    note: "چوونەژوورەوەی خێرا بەبێ پەیامی پشتڕاستکردن",
  },
};

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function RecycleMark({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id="rmg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4E8BFF" />
          <stop offset="1" stopColor="#1E63FF" />
        </linearGradient>
      </defs>
      <g stroke="url(#rmg)" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M32 9.5 40.4 24h-7.9" />
        <path d="M40.4 24 46 33.6" />
        <path d="M32 9.5 23.6 24" />
        <path d="M23.6 24 18 33.6" />
        <path d="M18 33.6 12.5 43.2a3.4 3.4 0 0 0 2.9 5.1H27" />
        <path d="M27 48.3l-6.1-6.1M27 48.3l-6.1 6.1" />
        <path d="M46 33.6l5.5 9.6a3.4 3.4 0 0 1-2.9 5.1H37" />
        <path d="M37 48.3l6.1-6.1M37 48.3l6.1 6.1" opacity="0.35" />
      </g>
      <circle cx="32" cy="32" r="26" stroke="url(#rmg)" strokeWidth="1.6" opacity="0.25" />
    </svg>
  );
}

function AuthPage() {
  const nav = useNavigate();
  const { refresh, session, loading } = useAuth();
  const [lang, setLang] = useState<Lang>("ar");
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gbusy, setGbusy] = useState(false);

  const t = T[lang];

  // الجلسة محفوظة: لو المستخدم داخل فعلاً لا نطلب منه الدخول مرة أخرى
  useEffect(() => {
    if (loading || !session?.user) return;
    const em = session.user.email?.toLowerCase();
    const r = ((session.user.user_metadata as { role?: RoleChoice })?.role) ?? "citizen";
    if (em === ADMIN_EMAIL) nav({ to: "/admin", replace: true });
    else if (r === "company") nav({ to: "/company", replace: true });
    else if (r === "collector") nav({ to: "/collector", replace: true });
    else nav({ to: "/citizen", replace: true });
  }, [loading, session, nav]);

  async function afterAuth(userEmail: string | undefined, r: RoleChoice) {
    await refresh();
    toast.success(t.welcome);
    if (userEmail?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin", replace: true });
    else if (r === "company") nav({ to: "/company", replace: true });
    else if (r === "collector") nav({ to: "/collector", replace: true });
    else nav({ to: "/citizen", replace: true });
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) return toast.error(t.emailBad);
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
        email: em,
        password,
        options: {
          data: {
            full_name: name.trim(),
            role,
            company_name: role === "company" ? company.trim() : null,
          },
        },
      });
      if (error) return toast.error(error.message);

      let s = data.session;
      if (!s) {
        const retry = await supabase.auth.signInWithPassword({ email: em, password });
        if (retry.error) return toast.error(retry.error.message);
        s = retry.data.session;
      }
      await afterAuth(s?.user?.email, role);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="relative mx-auto min-h-screen w-full max-w-[420px] overflow-hidden bg-white"
      style={{ fontFamily: "Cairo, system-ui" }}
    >
      <div
        className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}55, transparent)` }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full opacity-30 blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${BLUE}44, transparent)` }}
      />

      <section className="relative z-10 px-5 pb-6 pt-6">
        <div className="flex items-center justify-end">
          <button
            onClick={() => setLang(lang === "ar" ? "ku" : "ar")}
            className="flex h-11 items-center gap-2 rounded-2xl px-4 text-[12px] font-extrabold transition active:scale-95"
            style={{ background: SOFT, border: `1px solid ${BLUE}1F`, color: BLUE }}
          >
            <Globe size={17} />
            {t.switch}
          </button>
        </div>

        <div className="mt-7 flex flex-col items-center">
          <div
            className="grid h-[92px] w-[92px] place-items-center rounded-[30px]"
            style={{
              background: "rgba(30,99,255,0.05)",
              border: "1px solid rgba(30,99,255,0.16)",
              backdropFilter: "blur(8px)",
            }}
          >
            <RecycleMark size={50} />
          </div>
          <h1 className="mt-4 text-center text-[26px] font-black leading-tight" style={{ color: INK }}>
            {t.brand}
          </h1>
          <p className="mt-1 text-center text-[12px] font-medium" style={{ color: `${INK}99` }}>
            {t.tagline}
          </p>
        </div>
      </section>

      <section className="relative z-10 px-5 pb-12">
        <div
          className="rounded-[32px] p-5"
          style={{
            background: "rgba(255,255,255,0.72)",
            border: `1px solid ${BLUE}1F`,
            backdropFilter: "blur(14px)",
            boxShadow: "0 22px 50px -28px rgba(13,42,102,0.45)",
          }}
        >
          <button
            onClick={googleSignIn}
            disabled={gbusy}
            className="flex h-[58px] w-full items-center justify-center gap-3 rounded-3xl text-[14px] font-extrabold transition active:scale-[0.98] disabled:opacity-60"
            style={{ background: "rgba(255,255,255,0.85)", border: `1px solid ${BLUE}26`, color: INK }}
          >
            {gbusy ? <Loader2 className="animate-spin" size={18} /> : <GoogleIcon />}
            {t.google}
          </button>

          <div className="my-5 flex items-center gap-3">
            <span className="h-px flex-1" style={{ background: `${BLUE}1F` }} />
            <span className="text-[11px] font-bold" style={{ color: `${INK}80` }}>{t.or}</span>
            <span className="h-px flex-1" style={{ background: `${BLUE}1F` }} />
          </div>

          <div className="mb-5 grid grid-cols-2 gap-1.5 rounded-3xl p-1.5" style={{ background: SOFT }}>
            {(["signin", "signup"] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="h-11 rounded-2xl text-[13px] font-extrabold transition active:scale-95"
                style={mode === m ? { background: BLUE, color: "#fff" } : { color: `${INK}99` }}
              >
                {m === "signin" ? t.signin : t.signup}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <>
                <Field icon={<User size={18} />} label={t.name} value={name} onChange={setName} />
                <div className="flex flex-col gap-2">
                  <span className="px-1 text-[10px] font-bold" style={{ color: `${BLUE}B3` }}>{t.accountType}</span>
                  <div className="grid grid-cols-3 gap-1.5 rounded-3xl p-1.5" style={{ background: SOFT }}>
                    {(["citizen", "collector", "company"] as RoleChoice[]).map((r) => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        className="h-11 rounded-2xl text-[12px] font-extrabold transition active:scale-95"
                        style={role === r ? { background: BLUE, color: "#fff" } : { color: `${INK}99` }}
                      >
                        {r === "citizen" ? t.citizen : r === "collector" ? t.collector : t.company_}
                      </button>
                    ))}
                  </div>
                </div>
                {role === "company" && (
                  <Field icon={<Building2 size={18} />} label={t.company} value={company} onChange={setCompany} />
                )}
              </>
            )}

            <Field
              icon={<Mail size={18} />}
              label={t.email}
              value={email}
              onChange={setEmail}
              type="email"
              dir="ltr"
              placeholder="name@mail.com"
            />
            <PasswordField
              label={t.password}
              value={password}
              onChange={setPassword}
              show={showPassword}
              onToggle={() => setShowPassword((v) => !v)}
              placeholder="••••••"
            />

            <button
              onClick={() => submit()}
              disabled={busy}
              className="mt-1 flex h-[58px] w-full items-center justify-center gap-2 rounded-3xl text-[14px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
              style={{ background: BLUE, boxShadow: "0 18px 40px -14px rgba(30,99,255,0.55)" }}
            >
              {busy && <Loader2 className="animate-spin" size={16} />}
              {mode === "signin" ? t.submitIn : t.submitUp}
            </button>

            <p className="text-center text-[11px] font-medium" style={{ color: `${INK}80` }}>
              <Lock size={11} className="inline" /> {t.note}
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = "text",
  dir,
  placeholder,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-[10px] font-bold" style={{ color: `${BLUE}B3` }}>{label}</span>
      <div className="flex h-[54px] items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
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

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-[10px] font-bold" style={{ color: `${BLUE}B3` }}>{label}</span>
      <div className="flex h-[54px] items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir="ltr"
          className="flex-1 bg-transparent text-[13px] font-bold outline-none"
          style={{ color: INK }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full p-1.5 transition active:scale-90"
          style={{ color: `${BLUE}B3` }}
          aria-label={show ? "إخفاء" : "إظهار"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.4 0-9.9-3.4-11.4-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6.3 5.3C41.4 34.9 44 30 44 24c0-1.2-.1-2.3-.4-3.5z" />
    </svg>
  );
}
