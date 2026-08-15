import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

/**
 * Realtime in-app notifications for collector ↔ company join requests.
 * - Company: gets alerted on a new pending request, with a link to review it.
 * - Collector: gets alerted when the company approves or rejects the request.
 */
export function LinkNotifications() {
  const { user } = useAuth();
  const router = useRouter();
  const qc = useQueryClient();

  useEffect(() => {
    if (!user) return;
    const uid = user.id;

    const go = (to: string) => router.navigate({ to });

    const channel = supabase
      .channel(`collector-links-${uid}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "collector_links", filter: `company_id=eq.${uid}` },
        () => {
          qc.invalidateQueries({ queryKey: ["company-collectors"] });
          toast.info("طلب انضمام جديد من مجمع", {
            description: "راجع الطلب واقبله أو ارفضه الآن",
            duration: 8000,
            action: { label: "مراجعة الطلب", onClick: () => go("/company/collectors") },
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "collector_links", filter: `collector_id=eq.${uid}` },
        (payload) => {
          const next = (payload.new as { status?: string } | null)?.status;
          const prev = (payload.old as { status?: string } | null)?.status;
          if (!next || next === prev) return;
          qc.invalidateQueries({ queryKey: ["my-links"] });
          if (next === "approved") {
            toast.success("تم قبول طلب انضمامك", {
              description: "صرت ضمن فريق الشركة، تابع الفرص المتاحة",
              duration: 8000,
              action: { label: "فتح شركتي", onClick: () => go("/collector/join") },
            });
          } else if (next === "rejected") {
            toast.error("تم رفض طلب انضمامك", {
              description: "يمكنك اختيار شركة أخرى قريبة منك",
              duration: 8000,
              action: { label: "اختيار شركة", onClick: () => go("/collector/join") },
            });
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, router, qc]);

  return null;
}
