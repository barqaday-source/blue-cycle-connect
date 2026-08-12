import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Save } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/account/edit")({
  head: () => ({ meta: [{ title: "تعديل المعلومات — تدوير بلو" }] }),
  component: EditAccount,
});

function EditAccount() {
  const { user, profile, refresh, isCompany } = useAuth();
  const nav = useNavigate();
  const [full_name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [company_name, setCompany] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setCity(profile.city ?? "");
      setCompany(profile.company_name ?? "");
    }
  }, [profile]);

  async function save() {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name, phone, city, company_name })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    await refresh();
    toast.success("تم الحفظ");
    nav({ to: isCompany ? "/company/profile" : "/citizen/profile" });
  }

  const backTo = isCompany ? "/company/profile" : "/citizen/profile";
  return (
    <>
      <AppHeader
        back={
          <Link to={backTo} className="glass press grid h-11 w-11 place-items-center rounded-2xl press text-foreground">
            <ArrowRight size={18} />
          </Link>
        }
        title={isCompany ? "بيانات المعمل" : "معلوماتي الشخصية"}
        subtitle="تدوير بلو"
        right={<div className="h-11 w-11" />}
      />
      <div className="flex flex-col gap-3">
        <Field label="الاسم الكامل" value={full_name} onChange={setName} />
        {isCompany && <Field label="اسم الشركة / المعمل" value={company_name} onChange={setCompany} />}
        <Field label="رقم الهاتف (واتساب)" value={phone} onChange={setPhone} inputMode="tel" />
        <Field label="المحافظة / المدينة" value={city} onChange={setCity} />
      </div>
      <button
        onClick={save}
        disabled={busy}
        className="btn-primary-gradient mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-extrabold disabled:opacity-60"
      >
        {busy ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} حفظ التعديلات
      </button>
    </>
  );
}

function Field({
  label, value, onChange, inputMode,
}: { label: string; value: string; onChange: (v: string) => void; inputMode?: "tel" | "text" | "numeric" }) {
  return (
    <label className="glass-card block rounded-2xl p-3">
      <span className="mb-1 block text-[11px] font-bold text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode={inputMode ?? "text"}
        className="w-full bg-transparent text-sm font-bold outline-none"
      />
    </label>
  );
}
