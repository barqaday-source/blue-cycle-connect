import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Recycle, Phone, User, Building2, LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth, ADMIN_EMAIL } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "تسجيل الدخول — تدوير بلو" }] }),
  component: AuthPage,
});

type RoleChoice = "citizen" | "company";

// Normalize Iraqi phone to E.164-ish digits (964XXXXXXXXXX)
function normalizePhone(raw: string) {
  let d = raw.replace(/\D+/g, "");
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("0")) d = "964" + d.slice(1);
  if (!d.startsWith("964") && d.length === 10) d = "964" + d;
  return d;
}

// Synthetic email so we can use password auth without SMS provider.
function phoneToEmail(phone: string) {
  return `u${phone}@phone.tadweerblue.app`;
}

function derivePassword(phone: string) {
  const base = `tadweer-blue::${phone}::v1`;
  let h = 0;
  for (let i = 0; i < base.length; i++) h = (h * 31 + base.charCodeAt(i)) | 0;
  return `Tb!${btoa(base).replace(/=/g, "")}${Math.abs(h)}`;
}

function AuthPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);

  async function loginOrSignup() {
    const cleanName = name.trim();
    const digits = normalizePhone(phone);
    if (!cleanName) return toast.error("الرجاء إدخال الاسم الكامل");
    if (digits.length < 12) return toast.error("رقم الهاتف غير صحيح — مثال: 07701234567");
    if (role === "company" && !company.trim()) return toast.error("الرجاء إدخال اسم الشركة");

    setBusy(true);
    const email = phoneToEmail(digits);
    const password = derivePassword(digits);

    let { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const signup = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: cleanName,
            phone: digits,
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
      if (!data.session) {
        const retry = await supabase.auth.signInWithPassword({ email, password });
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
      if (data.session.user?.email?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
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
          سجّل برقم هاتفك بنقرة واحدة
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <RoleSeg value={role} onChange={setRole} />

        <Field label="الاسم الكامل" icon={<User size={18} />} placeholder="مثال: أحمد محمد" value={name} onChange={setName} autoComplete="name" />
        {role === "company" && (
          <Field label="اسم الشركة / المعمل" icon={<Building2 size={18} />} placeholder="مثال: شركة تدوير بغداد" value={company} onChange={setCompany} autoComplete="organization" />
        )}
        <Field label="رقم الهاتف" icon={<Phone size={18} />} placeholder="07701234567" value={phone} onChange={setPhone} type="tel" inputMode="numeric" autoComplete="tel" dir="ltr" />

        <button
          onClick={loginOrSignup}
          disabled={busy}
          className="btn-primary-gradient press tap-ring mt-2 inline-flex h-[56px] items-center justify-center gap-2 rounded-2xl text-base font-extrabold disabled:opacity-60"
        >
          {busy ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
          تسجيل الدخول / إنشاء حساب
        </button>

        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          دخول فوري بدون رمز تحقق — فقط رقم هاتفك واسمك.
        </p>
      </div>

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
  inputMode?: "text" | "email" | "numeric" | "tel";
  autoComplete?: string;
  dir?: "ltr" | "rtl";
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

function RoleSeg({ value, onChange }: { value: RoleChoice; onChange: (v: RoleChoice) => void }) {
  return (
    <div className="glass-card grid grid-cols-2 gap-1 rounded-2xl p-1">
      {(["citizen", "company"] as const).map((r) => (
        <button
          key={r}
          onClick={() => onChange(r)}
          className={`h-12 rounded-xl text-sm font-extrabold transition active:scale-95 ${
            value === r ? "btn-primary-gradient" : "text-muted-foreground"
          }`}
        >
          {r === "citizen" ? "مواطن" : "شركة"}
        </button>
      ))}
    </div>
  );
}
