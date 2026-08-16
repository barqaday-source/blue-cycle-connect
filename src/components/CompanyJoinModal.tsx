/**
 * Company Join Request Modal Component
 * Handles company join requests with confirmation and duplicate prevention
 */

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface CompanyJoinRequest {
  id: string;
  status: "pending" | "approved" | "rejected";
  company_id: string;
  created_at: string;
  updated_at: string;
}

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string;
  companyName: string;
}

export function CompanyJoinModal({ isOpen, onOpenChange, companyId, companyName }: Props) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check for existing pending requests
  const { data: existingRequest, isLoading: checkingRequest } = useQuery({
    queryKey: ["company-join-request", companyId, user?.id],
    enabled: !!user && isOpen,
    queryFn: async () => {
      if (!user) return null;

      const { data } = await supabase
        .from("company_join_requests")
        .select("*")
        .eq("user_id", user.id)
        .eq("company_id", companyId)
        .maybeSingle();

      return (data as CompanyJoinRequest) || null;
    },
  });

  // Submit join request mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("User not authenticated");

      // Check again for duplicates (prevent race condition)
      const { data: existing } = await supabase
        .from("company_join_requests")
        .select("id")
        .eq("user_id", user.id)
        .eq("company_id", companyId)
        .maybeSingle();

      if (existing) {
        throw new Error("لديك طلب انضمام قيد الانتظار بالفعل");
      }

      const { error } = await supabase.from("company_join_requests").insert({
        user_id: user.id,
        company_id: companyId,
        status: "pending",
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(`تم إرسال طلب الانضمام إلى ${companyName}`);
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "حدث خطأ");
    },
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await joinMutation.mutateAsync();
    setIsSubmitting(false);
  };

  // If there's already a pending/approved request, show different UI
  if (existingRequest) {
    const statusMap = {
      pending: { label: "⏳ قيد الانتظار", color: "text-yellow-600" },
      approved: { label: "✅ موافق عليه", color: "text-green-600" },
      rejected: { label: "❌ مرفوض", color: "text-red-600" },
    };

    const status = statusMap[existingRequest.status];

    return (
      <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حالة الطلب</AlertDialogTitle>
            <AlertDialogDescription>
              طلب الانضمام الخاص بك إلى <strong>{companyName}</strong>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="my-4 rounded-lg bg-muted p-4">
            <p className={`text-center text-lg font-bold ${status.color}`}>
              {status.label}
            </p>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              تاريخ الطلب:{" "}
              {new Date(existingRequest.created_at).toLocaleDateString("ar-EG")}
            </p>
          </div>
          <AlertDialogCancel className="w-full">إغلاق</AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>طلب الانضمام إلى الشركة</AlertDialogTitle>
          <AlertDialogDescription>
            هل تريد إرسال طلب انضمام إلى <strong>{companyName}</strong>؟
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="my-4 space-y-2 rounded-lg bg-blue-50 p-4 text-sm">
          <p className="font-semibold text-blue-900">📋 ماذا يحدث بعد إرسال الطلب؟</p>
          <ul className="mt-2 space-y-1 text-blue-800">
            <li>✓ سيتم مراجعة طلبك من قبل إدارة الشركة</li>
            <li>✓ ستتلقى إخطاراً عند الموافقة أو الرفض</li>
            <li>✓ يمكنك متابعة حالة الطلب من حسابك</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <AlertDialogCancel className="flex-1">إلغاء</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSubmit}
            disabled={isSubmitting || checkingRequest}
            className="flex-1"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
