import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Lock, User, Building2, Loader2, Recycle, Eye, EyeOff } from "lucide-react";
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
type RoleChoice = "citizen" | "collector" | "company";
type AuthStep = "role-select" | "auth-form" | "otp-verify";

const T = {
  ar: {
    ar: "العربية", ku: "کوردی",
    brand: "تدوير بلو",
    tagline: "أعد التدوير • اكسب • احمِ البيئة",
    signin: "دخول", signup: "تسجيل",
    google: "متابعة عبر Google",
    or: "أو",
    email: "البريد الإلكتروني", password: "كلمة السر",
    confirmPassword: "تأكيد كلمة السر",
    name: "الاسم الكامل", company: "اسم الشركة",
    phone: "رقم الهاتف",
    roleCitizen: "مواطن عادي", roleCollector: "مجمع", roleCompany: "شركة تدوير",
    roleDesc: {
      citizen: "انشر موادك واكسب نقداً مباشرة",
      collector: "اجمع المواد وتواصل مع المواطنين",
      company: "إدارة عمليات التدوير الكاملة"
    },
    submitIn: "دخول", submitUp: "إنشاء حساب",
    emailBad: "بريد إلكتروني غير صحيح",
    passBad: "كلمة السر يجب أن تكون 6 أحرف على الأقل",
    passMismatch: "كلمات السر غير متطابقة",
    nameBad: "أدخل الاسم الكامل",
    companyBad: "أدخل اسم الشركة",
    phoneBad: "أدخل رقم هاتف صحيح",
    signinFail: "بيانات الدخول غير صحيحة",
    welcome: "أهلاً وسهلاً بك",
    otpSent: "تم إرسال رمز التحقق إلى بريدك",
    enterOtp: "أدخل رمز التحقق",
    otpExpired: "انتهت صلاحية الرمز، حاول مجدداً",
    resendOtp: "إعادة إرسال",
    verifying: "جاري التحقق...",
    loading: "جاري التحميل...",
    selectRole: "اختر نوع حسابك",
    back: "العودة",
    changeRole: "تغيير نوع الحساب",
  },
  ku: {
    ar: "العربية", ku: "کوردی",
    brand: "تەدویری بلو",
    tagline: "دووبارە بەکاربێنە • قازانج بکە • ژینگە بپارێزە",
    signin: "چوونەژوورەوە", signup: "خۆتۆمارکردن",
    google: "بەردەوامبوون بە Google",
    or: "یان",
    email: "ئیمەیڵ", password: "وشەی نهێنی",
    confirmPassword: "تأیید وشەی نهێنی",
    name: "ناوی تێدا", company: "ناوی کۆمپانیا",
    phone: "ژمارەی تێلەفۆن",
    roleCitizen: "هاووڵاتی", roleCollector: "کۆکەر", roleCompany: "کۆمپانیای تەدویر",
    roleDesc: {
      citizen: "پرۆژەکانت بڵاو بکە و بەفیری کاش بکە",
      collector: "مادەکان کۆ بکە و بە دانیشتووان پەیوەندی بکە",
      company: "بەڕێوەبەری پڕۆسەی تەدویری تێدا"
    },
    submitIn: "چوونەژوورەوە", submitUp: "دروستکردن",
    emailBad: "ئیمەیڵ ڕاست نییە",
    passBad: "وشەی نهێنی ٦ پیت بێت",
    passMismatch: "وشەی نهێنی یەکسان نییە",
    nameBad: "ناوی تێدا بنووسە",
    companyBad: "ناوی کۆمپانیا بنووسە",
    phoneBad: "ژمارەی تێلەفۆن ڕاست بنووسە",
    signinFail: "زانیارییەکان هەڵەیە",
    welcome: "بەخێربێیت",
    otpSent: "کۆد بۆ ئیمەیڵەکەت نێردرا",
    enterOtp: "کۆدی تێپەڕاندن بنووسە",
    otpExpired: "کۆد قۆتایی هات، دووبارە هەوڵ بدە",
    resendOtp: "دوبارە نێردان",
    verifying: "پشکنین...",
    loading: "بارکردن...",
    selectRole: "جۆری ئاکاونتت هەڵبژێرە",
    back: "گەڕاوە",
    changeRole: "گۆڕینی جۆری ئاکاونت",
  },
};

const BLUE = "#1E63FF";
const SOFT = "#EEF3FE";
const INK = "#0D2A66";

function AuthPage() {
  const nav = useNavigate();
  const { refresh } = useAuth();
  const [lang, setLang] = useState<Lang>("ar");
  const [step, setStep] = useState<AuthStep>("role-select");
  const [mode, setMode] = useState<Mode>("signin");
  const [role, setRole] = useState<RoleChoice>("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [gbusy, setGbusy] = useState(false);
  const [otpBusy, setOtpBusy] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  
  const t = T[lang];

  async function afterAuth(userEmail: string | undefined, r: RoleChoice) {
    await refresh();
    toast.success(t.welcome);
    if (userEmail?.toLowerCase() === ADMIN_EMAIL) nav({ to: "/admin" });
    else if (r === "company") nav({ to: "/company" });
    else if (r === "collector") nav({ to: "/collector" });
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

  async function sendOtp() {
    const em = email.trim().toLowerCase();
    if (!em || !em.includes("@")) return toast.error(t.emailBad);
    
    setBusy(true);
    try {
      setOtpSent(true);
      setResendTimer(60);
      toast.success(t.otpSent);
      
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    if (!otp || otp.length < 6) return toast.error("أدخل رمز التحقق كاملاً");
    
    setOtpBusy(true);
    try {
      await submit(true);
    } finally {
      setOtpBusy(false);
    }
  }

  async function submit(otpVerified = false) {
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
      if (password !== confirmPassword) return toast.error(t.passMismatch);
      if (role === "company" && !company.trim()) return toast.error(t.companyBad);
      if ((role === "collector" || role === "company") && !phone.trim()) return toast.error(t.phoneBad);

      const { data, error } = await supabase.auth.signUp({
        email: em,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: name.trim(),
            role,
            company_name: role === "company" ? company.trim() : null,
            phone: (role === "collector" || role === "company") ? phone.trim() : null,
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

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setCompany("");
    setPhone("");
    setOtpSent(false);
    setOtp("");
  };

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
      <section className="relative z-10 px-5 pb-7 pt-6">
        <div className="flex items-center justify-between">
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
          <h1 className="mt-3 text-center text-[26px] font-black leading-tight" style={{ color: INK }}>{t.brand}</h1>
          <p className="mt-1 text-center text-[12px] font-medium" style={{ color: `${INK}99` }}>{t.tagline}</p>
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
          {step === "role-select" ? (
            // === خطوة 1: اختيار نوع الحساب ===
            <>
              <div className="mb-5 flex flex-col gap-1 text-center">
                <h2 className="text-[16px] font-bold" style={{ color: INK }}>
                  {t.selectRole}
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {(["citizen", "collector", "company"] as RoleChoice[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setMode("signin");
                      setStep("auth-form");
                      resetForm();
                    }}
                    className="flex flex-col gap-2 rounded-3xl p-4 text-right transition active:scale-[0.98] hover:shadow-md"
                    style={{
                      background: SOFT,
                      border: `2px solid ${BLUE}29`,
                      color: INK,
                    }}
                  >
                    <span className="text-[14px] font-bold">
                      {r === "citizen" ? t.roleCitizen : r === "collector" ? t.roleCollector : t.roleCompany}
                    </span>
                    <span className="text-[12px]" style={{ color: `${INK}80` }}>
                      {t.roleDesc[r]}
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : step === "otp-verify" ? (
            // === خطوة 3: التحقق عبر OTP ===
            <>
              <div className="mb-6 flex flex-col gap-2 text-center">
                <h2 className="text-[18px] font-bold" style={{ color: INK }}>
                  {t.enterOtp}
                </h2>
                <p className="text-[12px]" style={{ color: `${INK}80` }}>
                  {email}
                </p>
              </div>

              <div className="mb-6 flex justify-center gap-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^\d?$/.test(val)) {
                        const newOtp = otp.substring(0, i) + val + otp.substring(i + 1);
                        setOtp(newOtp);
                        if (val && i < 5) {
                          const nextInput = document.querySelector(
                            `input[data-otp-index="${i + 1}"]`
                          ) as HTMLInputElement;
                          nextInput?.focus();
                        }
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && !otp[i] && i > 0) {
                        const prevInput = document.querySelector(
                          `input[data-otp-index="${i - 1}"]`
                        ) as HTMLInputElement;
                        prevInput?.focus();
                      }
                    }}
                    data-otp-index={i}
                    disabled={otpBusy}
                    className="h-12 w-12 rounded-lg border-2 text-center text-lg font-bold outline-none disabled:opacity-50 transition"
                    style={{ borderColor: `${BLUE}29`, color: INK }}
                  />
                ))}
              </div>

              <button
                onClick={verifyOtp}
                disabled={otpBusy || otp.length < 6}
                className="mb-3 flex h-[58px] w-full items-center justify-center gap-2 rounded-3xl text-[14px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
                style={{ background: BLUE, boxShadow: "0 18px 40px -14px rgba(30,99,255,0.55)" }}
              >
                {otpBusy && <Loader2 className="animate-spin" size={16} />}
                {otpBusy ? t.verifying : "التحقق"}
              </button>

              <button
                onClick={() => {
                  setStep("auth-form");
                  setOtpSent(false);
                  setOtp("");
                }}
                disabled={otpBusy}
                className="w-full rounded-3xl py-3 text-[13px] font-bold transition disabled:opacity-60"
                style={{ background: SOFT, color: BLUE }}
              >
                {t.back}
              </button>

              {resendTimer > 0 ? (
                <p className="mt-4 text-center text-[12px]" style={{ color: `${INK}99` }}>
                  إعادة إرسال بعد {resendTimer}ث
                </p>
              ) : (
                <button
                  onClick={sendOtp}
                  disabled={busy}
                  className="mt-4 w-full rounded-3xl py-3 text-[13px] font-bold transition disabled:opacity-60"
                  style={{ background: SOFT, color: BLUE }}
                >
                  {t.resendOtp}
                </button>
              )}
            </>
          ) : (
            // === خطوة 2: نموذج الدخول/التسجيل ===
            <>
              <div className="grid grid-cols-2 gap-1.5 rounded-3xl p-1.5 mb-5"
                   style={{ background: SOFT }}>
                {(["signin", "signup"] as Mode[]).map((m) => {
                  const active = mode === m;
                  return (
                    <button
                      key={m}
                      onClick={() => {
                        setMode(m);
                        resetForm();
                      }}
                      className="h-12 rounded-[22px] text-[13px] font-extrabold transition active:scale-[0.98]"
                      style={active ? { background: BLUE, color: "#fff", boxShadow: "0 12px 24px -14px rgba(30,99,255,0.7)" } : { color: `${BLUE}B3` }}
                    >
                      {m === "signin" ? t.signin : t.signup}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-4">
                <button
                  onClick={googleSignIn}
                  disabled={gbusy}
                  className="flex h-[54px] w-full items-center justify-center gap-2 rounded-3xl text-[13px] font-extrabold transition active:scale-[0.98] disabled:opacity-60"
                  style={{ background: "rgba(30,99,255,0.05)", border: `1px solid ${BLUE}29`, color: INK, backdropFilter: "blur(8px)" }}
                >
                  {gbusy ? <Loader2 className="animate-spin" size={16} /> : <GoogleIcon />}
                  {gbusy ? t.loading : t.google}
                </button>

                <div className="flex items-center gap-3">
                  <span className="h-px flex-1" style={{ background: `${BLUE}26` }} />
                  <span className="text-[10px] font-bold" style={{ color: `${BLUE}99` }}>{t.or}</span>
                  <span className="h-px flex-1" style={{ background: `${BLUE}26` }} />
                </div>

                {mode === "signup" && (
                  <>
                    <Field label={t.name} icon={<User size={16} />} value={name} onChange={setName} />
                    {role === "company" && (
                      <Field label={t.company} icon={<Building2 size={16} />} value={company} onChange={setCompany} />
                    )}
                    {(role === "collector" || role === "company") && (
                      <Field label={t.phone} icon={<Building2 size={16} />} value={phone} onChange={setPhone} type="tel" dir="ltr" placeholder="+964" />
                    )}
                  </>
                )}

                <Field 
                  label={t.email} 
                  icon={<Mail size={16} />} 
                  value={email} 
                  onChange={setEmail} 
                  type="email" 
                  dir="ltr" 
                  placeholder="you@example.com"
                  disabled={otpSent}
                />

                <PasswordField
                  label={t.password}
                  value={password}
                  onChange={setPassword}
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                  placeholder="••••••"
                />

                {mode === "signup" && (
                  <PasswordField
                    label={t.confirmPassword}
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    placeholder="••••••"
                  />
                )}

                <button
                  onClick={otpSent ? verifyOtp : (mode === "signin" ? submit : sendOtp)}
                  disabled={busy || otpBusy}
                  className="mt-2 inline-flex h-[58px] w-full items-center justify-center gap-2 rounded-3xl text-[14px] font-extrabold text-white transition active:scale-[0.98] disabled:opacity-60"
                  style={{ background: BLUE, boxShadow: "0 18px 40px -14px rgba(30,99,255,0.55)" }}
                >
                  {(busy || otpBusy) && <Loader2 className="animate-spin" size={16} />}
                  {otpSent ? t.verifying : (mode === "signin" ? t.submitIn : t.submitUp)}
                </button>

                {mode === "signup" && (
                  <button
                    onClick={() => {
                      setStep("role-select");
                      resetForm();
                    }}
                    className="w-full rounded-3xl py-3 text-[13px] font-bold transition"
                    style={{ background: SOFT, color: BLUE }}
                  >
                    {t.changeRole}
                  </button>
                )}
              </div>
            </>
          )}
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
  disabled = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  dir?: "ltr" | "rtl";
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="px-1 text-[10px] font-bold" style={{ color: `${BLUE}B3` }}>{label}</span>
      <div className="flex h-[52px] items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
        <input
          type={type}
          dir={dir}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent text-[13px] font-bold outline-none disabled:opacity-50 transition"
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
      <div className="flex h-[52px] items-center gap-2 rounded-3xl px-4" style={{ background: SOFT, border: `1px solid ${BLUE}14` }}>
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
          className="rounded-full p-1.5 transition active:scale-90 hover:opacity-70"
          style={{ color: `${BLUE}B3`, background: "transparent", border: "none" }}
          aria-label={show ? "إخفاء" : "إظهار"}
          tabIndex={0}
        >
          {show ? <EyeOff size={18} strokeWidth={2} /> : <Eye size={18} strokeWidth={2} />}
        </button>
      </div>
    </label>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.5-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.2 34.9 26.7 36 24 36c-5.4 0-9.9-3.4-11.4-8.1l-6.5 5C9.4 39.6 16.1 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.7 2-2 3.7-3.7 4.9l6.3 5.3C41.4 34.9 44 30 44 24c0-1.2-.1-2.3-.4-3.5z"/>
    </svg>
  );
}
