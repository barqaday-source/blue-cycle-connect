import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

/**
 * Circular avatar with real camera/gallery upload (compressed client-side),
 * stored in the private `avatars` bucket and saved on the profile.
 */
export function AvatarUpload({ size = 80, fallback = "ت" }: { size?: number; fallback?: string }) {
  const { user, profile, refresh } = useAuth();
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function compress(file: File): Promise<Blob> {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const max = 512;
    const ratio = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(img.width * ratio);
    canvas.height = Math.round(img.height * ratio);
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    return await new Promise((res) => canvas.toBlob((b) => res(b!), "image/jpeg", 0.8));
  }

  async function onPick(file: File) {
    if (!user) return;
    setBusy(true);
    try {
      const blob = await compress(file);
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error } = await supabase.storage.from("avatars").upload(path, blob, {
        contentType: "image/jpeg",
        upsert: true,
      });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from("avatars")
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      const { error: upErr } = await supabase
        .from("profiles")
        .update({ avatar_url: signed?.signedUrl ?? null })
        .eq("id", user.id);
      if (upErr) throw upErr;
      await refresh();
      toast.success("تم تحديث الصورة");
    } catch (e) {
      console.error(e);
      toast.error("تعذّر رفع الصورة");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onPick(e.target.files[0])}
      />
      <button
        onClick={() => inputRef.current?.click()}
        aria-label="تغيير الصورة"
        className="press tap-ring grid h-full w-full place-items-center overflow-hidden rounded-full bg-primary-soft text-2xl font-extrabold text-primary"
      >
        {busy ? (
          <Loader2 className="animate-spin" size={22} />
        ) : profile?.avatar_url ? (
          <img src={profile.avatar_url} alt="صورة الحساب" className="h-full w-full object-cover" />
        ) : (
          fallback
        )}
      </button>
      <span className="pointer-events-none absolute -bottom-1 -left-1 grid h-7 w-7 place-items-center rounded-full bg-primary text-white shadow-lg">
        <Camera size={14} />
      </span>
    </div>
  );
}
