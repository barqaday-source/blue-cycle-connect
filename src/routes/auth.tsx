import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";
import logoAsset from "@/assets/tadweer-logo.asset.json";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تدوير بلو — تسجيل الدخول" }] }),
  component: AuthPage,
});

type Lang = "ar" | "ku";
type Mode = "signin" | "signup";
type RoleChoice = "citizen" | "company";

const T = {
  ar: {
    dir: "rtl" as const,
    brand: "تدوير بلو",
    tagline: "أعد التدوير، اكسب، احمِ البيئة",
    signin: "دخول",
    signup: "حساب جديد",
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
  },
  ku: {
    dir: "rtl" as const,
    brand: "تەدویری بلو",
    tagline: "دووبارە بەکاربێنە، قازانج بکە، ژینگە بپارێزە",
    signin: "چوونەژوورەوە",
    signup: "هەژماری نوێ",
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
  },
};

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
    <main dir={t.dir} className="mx-auto min-h-screen w-full max-w-[460px] bg-white">
      {/* Blue hero card with language toggle */}
      <section className="relative rounded-b-[36px] bg-[#1E63FF] px-6 pb-14 pt-6 text-white">
        {/* Language pill */}
        <div className="mb-6 inline-flex items-center gap-1 rounded-full bg-white/15 p-1 backdrop-blur">
          {(["ar", "ku"] as Lang[]).map((L) => (
            <button
              key={L}
              onClick={() => setLang(L)}
              className={`rounded-full px-4 py-1.5 text-xs font-extrabold transition ${
                lang === L ? "bg-white text-[#1E63FF]" : "text-white/90"
              }`}
            >
              {L === "ar" ? "العربية" : "کوردی"}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 pt-2">
          <div className="grid h-24 w-24 place-items-center overflow-hidden rounded-[26px] bg-white shadow-[0_10px_30px_-8px_rgba(0,0,0,0.35)]">
            <img src={logoAsset.url} alt={t.brand} className="h-full w-full object-cover" />
          </div>
          <h1 className="mt-1 text-3xl font-black tracking-tight">{t.brand}</h1>
          <p className="text-sm font-medium text-white/85">{t.tagline}</p>
        </div>
      </section>

      {/* Tabs card that overlaps the hero */}
      <section className="px-6">
        <div className="-mt-8 grid grid-cols-2 gap-1 rounded-full bg-[#EEF3FE] p-1 shadow-[0_6px_20px_-8px_rgba(30,99,255,0.35)]">
          {(["signin", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`h-11 rounded-full text-sm font-extrabold transition ${
                mode === m ? "bg-[#1E63FF] text-white shadow" : "text-[#1E63FF]/70"
              }`}
            >
              {m === "signin" ? t.signin : t.signup}
            </button>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-4">
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
            className="mt-2 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-full bg-[#1E63FF] text-base font-extrabold text-white shadow-[0_12px_28px_-10px_rgba(30,99,255,0.6)] transition active:scale-[0.98] disabled:opacity-60"
          >
            {busy && <Loader2 className="animate-spin" size={18} />}
            {mode === "signin" ? t.submitIn : t.submitUp}
          </button>
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
      <span className="px-1 text-xs font-bold text-[#1E63FF]/80">{label}</span>
      <div className="flex h-[54px] items-center gap-3 rounded-full bg-[#EEF3FE] px-5">
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base font-bold text-[#0D2A66] outline-none placeholder:text-[#1E63FF]/40"
        />
        <span className="text-[#1E63FF]/70">{icon}</span>
      </div>
    </label>
  );
}

function RoleCard({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 items-center justify-center gap-2 rounded-full text-sm font-extrabold transition ${
        active ? "bg-[#1E63FF] text-white shadow" : "bg-[#EEF3FE] text-[#1E63FF]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
