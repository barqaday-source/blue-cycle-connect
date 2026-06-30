import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Recycle, Mail, User, Building2, LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — تدوير بلو" }] }),
  component: AuthPage,
});

type RoleChoice = "citizen" | "company";

// Deterministic password derived from email so users only need their email.
function derivePassword(email: string) {
  // simple, stable, opaque — not a security boundary (project is OTP-less by design)
  const base = `tadweer-blue::${email.toLowerCase().trim()}::v1`;
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) | 0;
  return `Tb!${btoa(base).replace(/=/g, "")}${Math.abs(h)}`;
}

function AuthPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);

  async function loginOrSignup() {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(cleanEmail);
    if (!cleanName) return toast.error("الرجاء إدخال الاسم الكامل");
    if (!emailOk) return toast.error("الإيميل غير صحيح — مثال: name@example.com");
    if (role === "company" && !company.trim()) return toast.error("الرجاء إدخال اسم الشركة");

    setBusy(true);
    const password = derivePassword(cleanEmail);

    // Try sign-in first (returning user)
    let { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password });

    if (error) {
      // New user — sign up
      const signup = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: cleanName,
            role,
            company_name: role === "company" ? company.trim() : null,
          },
        },
      });
      if (signup.error) {
        setBusy(false);
        return toast.error(signup.error.message);
      }
      data = signup.data as typeof data;
      // In case session isn't returned immediately, sign in again
      if (!data.session) {
        const retry = await supabase.auth.signInWithPassword({ email: cleanEmail, password });
        if (retry.error) {
          setBusy(false);
          return toast.error(retry.error.message);
        }
        data = retry.data;
      }
    }

    setBusy(false);
    if (data?.session) {
      await refresh();
      toast.success("أهلاً بك في تدوير بلو");
      if (cleanEmail === ADMIN_EMAIL) nav({ to: "/admin" });
      else if (role === "company") nav({ to: "/company" });
      else nav({ to: "/citizen" });
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
          {step === "info" ? "أهلاً بك — سجّل بإيميلك بخطوة واحدة" : `أدخل الرمز المرسل إلى ${email}`}
        </p>
      </div>

      {step === "info" ? (
        <div className="mt-8 flex flex-col gap-3">
          <RoleSeg value={role} onChange={setRole} />

          <Field label="الاسم الكامل" icon={<User size={18} />} placeholder="مثال: أحمد محمد" value={name} onChange={setName} autoComplete="name" />
          {role === "company" && (
            <Field label="اسم الشركة / المعمل" icon={<Building2 size={18} />} placeholder="مثال: شركة تدوير بغداد" value={company} onChange={setCompany} autoComplete="organization" />
          )}
          <Field label="البريد الإلكتروني" icon={<Mail size={18} />} placeholder="name@example.com" value={email} onChange={setEmail} type="email" inputMode="email" autoComplete="email" dir="ltr" />

          <button
            onClick={sendCode}
            disabled={busy}
            className="btn-primary-gradient mt-2 inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold transition active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : <ChevronLeft size={18} />}
            إرسال رمز الدخول
          </button>

          <p className="mt-2 text-center text-[11px] text-muted-foreground">
            سيصلك رمز مكوّن من 6 أرقام على إيميلك — مجاناً وبدون كلمة سر.
          </p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          <Field label="رمز التحقق" icon={<KeyRound size={18} />} placeholder="6 أرقام" value={code} onChange={setCode} inputMode="numeric" />
          <button
            onClick={verify}
            disabled={busy}
            className="btn-primary-gradient inline-flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-extrabold active:scale-[0.98] disabled:opacity-60"
          >
            {busy ? <Loader2 className="animate-spin" size={18} /> : null}
            تأكيد ودخول
          </button>
          <button onClick={() => setStep("info")} className="text-xs font-bold text-primary">
            تعديل الإيميل / إعادة الإرسال
          </button>
        </div>
      )}

      <Link to="/" className="mt-auto pt-6 text-center text-[12px] text-muted-foreground">
        العودة للصفحة الرئيسية
      </Link>
    </main>
  );
}

function Field({
  icon,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  inputMode,
  autoComplete,
  dir,
}: {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  inputMode?: "text" | "email" | "numeric";
  autoComplete?: string;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="glass flex flex-col gap-1 rounded-2xl px-4 py-2.5 transition focus-within:ring-2 focus-within:ring-primary/40">
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

function RoleSeg({ value, onChange }: { value: RoleChoice; onChange: (v: RoleChoice) => void }) {
  return (
    <div className="glass-card grid grid-cols-2 gap-1 rounded-2xl p-1">
      {(["citizen", "company"] as const).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`rounded-xl py-2.5 text-sm font-extrabold transition active:scale-95 ${
            value === r ? "btn-primary-gradient" : "text-muted-foreground"
          }`}
        >
          {r === "citizen" ? "مواطن" : "شركة"}
        </button>
      ))}
    </div>
  );
}
