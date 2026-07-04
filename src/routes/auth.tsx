import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, LogIn, UserPlus, Loader2, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — تدوير بلو" }] }),
  component: AuthPage,
});

type RoleChoice = "citizen" | "company";
type Mode = "signin" | "signup";

function AuthPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);

  async function afterAuth(userEmail: string | undefined, r: RoleChoice) {
    await refresh();
    toast.success("أهلاً بك في تدوير بلو");
    if (userEmail?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
    else if (r === "company") nav({ to: "/company" });
    else nav({ to: "/citizen" });
  }

  async function submit() {
    const em = email.trim().toLowerCase();
    if (!em || !em.includes("@")) return toast.error("بريد إلكتروني غير صالح");
    if (password.length < 6) return toast.error("كلمة السر يجب أن تكون 6 أحرف على الأقل");

    setBusy(true);
    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({ email: em, password });
        if (error) return toast.error("بيانات الدخول غير صحيحة");
        const r = ((data.user?.user_metadata as any)?.role as RoleChoice) ?? "citizen";
        await afterAuth(data.user?.email, r);
        return;
      }

      // signup
      if (!name.trim()) return toast.error("الرجاء إدخال الاسم الكامل");
      if (role === "company" && !company.trim()) return toast.error("الرجاء إدخال اسم الشركة");

      const { data, error } = await supabase.auth.signUp({
        email: em,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name.trim(),
            role,
            company_name: role === "company" ? company.trim() : null,
          },
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
    <main className="mx-auto flex min-h-screen w-full max-w-[460px] flex-col px-6 pb-10 pt-10">
      <div className="flex flex-col items-center gap-3">
        <div className="btn-primary-gradient grid h-20 w-20 place-items-center rounded-3xl">
          <Recycle size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-black">تدوير بلو</h1>
        <p className="text-center text-sm text-muted-foreground">
          {mode === "signin" ? "سجّل دخولك بالبريد وكلمة السر" : "أنشئ حسابك الجديد بسهولة"}
        </p>
      </div>

      {/* Mode tabs — card style, no capsule */}
      <div className="mt-8 grid grid-cols-2 gap-3">
        <ModeCard
          active={mode === "signin"}
          onClick={() => setMode("signin")}
          icon={<LogIn size={20} />}
          title="دخول"
          subtitle="لديّ حساب"
        />
        <ModeCard
          active={mode === "signup"}
          onClick={() => setMode("signup")}
          icon={<UserPlus size={20} />}
          title="حساب جديد"
          subtitle="إنشاء حساب"
        />
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {mode === "signup" && (
          <>
            <div className="grid grid-cols-2 gap-3">
              <RoleCard active={role === "citizen"} onClick={() => setRole("citizen")} icon={<User size={18} />} label="مواطن" />
              <RoleCard active={role === "company"} onClick={() => setRole("company")} icon={<Building2 size={18} />} label="شركة" />
            </div>
            <Field label="الاسم الكامل" icon={<User size={18} />} placeholder="أحمد محمد" value={name} onChange={setName} autoComplete="name" />
            {role === "company" && (
              <Field label="اسم الشركة" icon={<Building2 size={18} />} placeholder="شركة تدوير بغداد" value={company} onChange={setCompany} autoComplete="organization" />
            )}
          </>
        )}

        <Field label="البريد الإلكتروني" icon={<Mail size={18} />} placeholder="name@example.com" value={email} onChange={setEmail} type="email" inputMode="email" autoComplete="email" dir="ltr" />
        <Field label="كلمة السر" icon={<Lock size={18} />} placeholder="••••••••" value={password} onChange={setPassword} type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} dir="ltr" />

        <button
          onClick={submit}
          disabled={busy}
          className="btn-primary-gradient press tap-ring mt-2 inline-flex h-[60px] items-center justify-center gap-2 rounded-3xl text-base font-extrabold disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={18} /> : mode === "signin" ? <LogIn size={18} /> : <UserPlus size={18} />}
          {mode === "signin" ? "دخول" : "إنشاء حساب"}
        </button>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          يمكنك إضافة رقم هاتفك لاحقاً من إعدادات البروفايل ليتواصل معك المشترون.
        </p>
      </div>

      <Link to="/" className="mt-auto pt-6 text-center text-[12px] text-muted-foreground">
        العودة للصفحة الرئيسية
      </Link>
    </main>
  );
}

function Field({
  icon, label, placeholder, value, onChange, type = "text", inputMode, autoComplete, dir,
}: {
  icon: React.ReactNode; label: string; placeholder: string; value: string; onChange: (v: string) => void;
  type?: string; inputMode?: "text" | "email" | "numeric" | "tel"; autoComplete?: string; dir?: "ltr" | "rtl";
}) {
  return (
    <label className="glass flex min-h-[64px] flex-col justify-center gap-1 rounded-2xl px-4 py-2 transition focus-within:ring-2 focus-within:ring-primary/40">
      <span className="text-[10px] font-extrabold text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="text-primary">{icon}</span>
        <input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base font-bold outline-none placeholder:text-muted-foreground/50"
        />
      </div>
    </label>
  );
}

function ModeCard({ active, onClick, icon, title, subtitle }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press tap-ring flex flex-col items-center justify-center gap-1 rounded-3xl p-4 text-center transition ${
        active ? "btn-primary-gradient text-white" : "glass-card text-foreground"
      }`}
    >
      <span className={active ? "text-white" : "text-primary"}>{icon}</span>
      <span className="text-sm font-extrabold">{title}</span>
      <span className={`text-[10px] ${active ? "text-white/85" : "text-muted-foreground"}`}>{subtitle}</span>
    </button>
  );
}

function RoleCard({ active, onClick, icon, label }: {
  active: boolean; onClick: () => void; icon: React.ReactNode; label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`press flex items-center justify-center gap-2 rounded-2xl p-3 text-sm font-extrabold transition ${
        active ? "btn-primary-gradient text-white" : "glass-card text-foreground"
      }`}
    >
      <span className={active ? "text-white" : "text-primary"}>{icon}</span>
      {label}
    </button>
  );
}
