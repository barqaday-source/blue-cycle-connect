import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/account/privacy")({
  head: () => ({ meta: [{ title: "سياسة الخصوصية — تدوير بلو" }] }),
  component: PrivacyPage,
});

function PrivacyPage() {
  const { isCompany } = useAuth();
  const backTo = isCompany ? "/company/profile" : "/citizen/profile";
  return (
    <>
      <AppHeader
        back={
          <Link to={backTo} className="glass press grid h-11 w-11 place-items-center rounded-2xl press text-foreground">
            <ArrowRight size={18} />
          </Link>
        }
        title="سياسة الخصوصية"
        subtitle="تدوير بلو"
        right={<div className="h-11 w-11" />}
      />
      <article className="glass-card space-y-3 rounded-3xl p-5 text-sm leading-7 text-foreground/85">
        <p>نحن في «تدوير بلو» نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.</p>
        <p>نجمع فقط البيانات اللازمة لتشغيل الخدمة: الاسم، رقم الهاتف، المدينة، والموقع الجغرافي عند نشر وجبة أو إعلان.</p>
        <p>نستخدم الموقع لعرض الشحنات والشركات القريبة منك على الخريطة، ولا يتم مشاركة موقعك الدقيق مع أي طرف ثالث.</p>
        <p>يمكنك في أي وقت تعديل بياناتك أو حذف حسابك عبر التواصل مع الدعم الفني.</p>
        <p>للأسئلة أو الشكاوى تواصل معنا عبر واتساب من صفحة «الدعم الفني».</p>
      </article>
    </>
  );
}
