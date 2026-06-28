import { useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, RefreshCw, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

interface Props {
  bucket: "shipment-photos" | "ad-images";
  onUploaded: (path: string, signedUrl: string) => void;
  initialUrl?: string | null;
}

/**
 * Real camera/upload widget — uses the device camera via input[capture]
 * and uploads to private Supabase storage (signed URL returned).
 * Cost: image is compressed client-side (max 1280px, JPEG q=0.75) to keep storage low.
 */
export function PhotoCapture({ bucket, onUploaded, initialUrl }: Props) {
  const { user } = useAuth();
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [busy, setBusy] = useState(false);
  const camRef = useRef<HTMLInputElement>(null);
  const galRef = useRef<HTMLInputElement>(null);

  async function compress(file: File): Promise<Blob> {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = url;
    });
    const max = 1280;
    const ratio = Math.min(1, max / Math.max(img.width, img.height));
    const w = Math.round(img.width * ratio);
    const h = Math.round(img.height * ratio);
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
    URL.revokeObjectURL(url);
    return await new Promise((res) =>
      canvas.toBlob((b) => res(b!), "image/jpeg", 0.75),
    );
  }

  async function handleFile(file: File) {
    if (!user) {
      toast.error("سجل دخول أولاً");
      return;
    }
    setBusy(true);
    try {
      const blob = await compress(file);
      const path = `${user.id}/${Date.now()}.jpg`;
      const { error } = await supabase.storage.from(bucket).upload(path, blob, {
        contentType: "image/jpeg",
        upsert: false,
      });
      if (error) throw error;
      const { data: signed } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, 60 * 60 * 24 * 365);
      const url = signed?.signedUrl ?? "";
      setPreview(url);
      onUploaded(path, url);
      toast.success("تم رفع الصورة بنجاح");
    } catch (e) {
      toast.error("تعذّر رفع الصورة");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass-card relative overflow-hidden rounded-3xl">
      <input
        ref={camRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />
      <input
        ref={galRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      {preview ? (
        <div className="relative">
          <img src={preview} alt="معاينة" className="h-56 w-full object-cover" />
          <button
            onClick={() => setPreview(null)}
            className="absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-destructive shadow active:scale-90"
          >
            <X size={18} />
          </button>
          <button
            onClick={() => camRef.current?.click()}
            className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-primary active:scale-95"
          >
            <RefreshCw size={14} /> إعادة الالتقاط
          </button>
        </div>
      ) : (
        <div className="flex h-56 flex-col items-center justify-center gap-3 bg-gradient-to-br from-[oklch(0.85_0.05_220)] to-[oklch(0.7_0.12_245)] text-white">
          {busy ? (
            <Loader2 size={40} className="animate-spin" />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white/25 backdrop-blur">
              <Camera size={32} />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => camRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-primary shadow transition active:scale-95 disabled:opacity-60"
            >
              <Camera size={16} /> تصوير
            </button>
            <button
              onClick={() => galRef.current?.click()}
              disabled={busy}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur transition active:scale-95 disabled:opacity-60"
            >
              <ImagePlus size={16} /> من المعرض
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
