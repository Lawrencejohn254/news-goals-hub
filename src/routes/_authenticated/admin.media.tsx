import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchMedia, uploadMedia, deleteMedia, signedMediaUrl, type MediaItem } from "@/lib/site";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/media")({
  component: MediaAdmin,
});

function MediaAdmin() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const q = useQuery({
    queryKey: ["admin", "media"],
    queryFn: async () => {
      const rows = await fetchMedia();
      return Promise.all(
        rows.map(async (r) => ({ ...r, url: await signedMediaUrl(r.path) })),
      );
    },
  });

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      for (const f of Array.from(files)) await uploadMedia(f);
      toast.success("Uploaded");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = async (item: MediaItem) => {
    if (!confirm(`Delete ${item.file_name}?`)) return;
    try {
      await deleteMedia(item);
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "media"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed");
    }
  };

  const saveAlt = async (id: string, alt: string) => {
    const { error } = await supabase.from("media").update({ alt_text: alt }).eq("id", id);
    if (error) toast.error(error.message);
    else toast.success("Alt text saved");
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black">Media library</h1>
          <p className="text-sm text-muted-foreground">Images and files used across the site</p>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => onFiles(e.target.files)}
          />
          <Button
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
          >
            {busy ? "Uploading…" : "Upload files"}
          </Button>
        </div>
      </div>

      {q.isLoading && <p className="text-muted-foreground">Loading…</p>}
      {q.data?.length === 0 && (
        <p className="border border-dashed border-border p-10 text-center text-muted-foreground">
          No media yet. Upload your first file.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(q.data ?? []).map((m) => (
          <div key={m.id} className="border border-border bg-background">
            {m.mime_type?.startsWith("image/") ? (
              <img src={m.url} alt={m.alt_text ?? m.file_name} className="aspect-video w-full object-cover" />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-muted text-xs text-muted-foreground">
                {m.mime_type ?? "file"}
              </div>
            )}
            <div className="space-y-2 p-3">
              <p className="truncate text-xs font-semibold">{m.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {m.size_bytes ? `${Math.round(m.size_bytes / 1024)} KB` : ""}
              </p>
              <input
                defaultValue={m.alt_text ?? ""}
                placeholder="Alt text"
                onBlur={(e) => saveAlt(m.id, e.target.value)}
                className="w-full border border-input bg-background px-2 py-1 text-xs"
              />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(m.url);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => remove(m)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
