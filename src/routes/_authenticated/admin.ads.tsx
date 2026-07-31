import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AD_PLACEMENTS, type Ad } from "@/lib/site";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/admin/ads")({
  component: AdsAdmin,
});

const emptyAd = {
  name: "",
  placement: AD_PLACEMENTS[0] as string,
  image_url: "",
  target_url: "",
  html_code: "",
  starts_at: "",
  ends_at: "",
};

function AdsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyAd);
  const set = (patch: Partial<typeof emptyAd>) => setForm((f) => ({ ...f, ...patch }));

  const q = useQuery({
    queryKey: ["admin", "ads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "ads"] });

  const create = async () => {
    if (!form.name.trim()) return toast.error("Give the ad a name");
    const { error } = await supabase.from("ads").insert({
      name: form.name.trim(),
      placement: form.placement,
      image_url: form.image_url.trim() || null,
      target_url: form.target_url.trim() || null,
      html_code: form.html_code.trim() || null,
      starts_at: form.starts_at ? new Date(form.starts_at).toISOString() : null,
      ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
    });
    if (error) return toast.error(error.message);
    toast.success("Ad created");
    setForm(emptyAd);
    refresh();
  };

  const toggle = async (ad: Ad) => {
    const { error } = await supabase.from("ads").update({ is_active: !ad.is_active }).eq("id", ad.id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this ad?")) return;
    const { error } = await supabase.from("ads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">Ads</h1>

      <div className="mb-8 grid gap-3 border border-border bg-background p-4 md:grid-cols-2">
        <div>
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <Label>Placement</Label>
          <select
            value={form.placement}
            onChange={(e) => set({ placement: e.target.value })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            {AD_PLACEMENTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label>Image URL</Label>
          <Input value={form.image_url} onChange={(e) => set({ image_url: e.target.value })} />
        </div>
        <div>
          <Label>Target URL</Label>
          <Input value={form.target_url} onChange={(e) => set({ target_url: e.target.value })} />
        </div>
        <div>
          <Label>Starts at</Label>
          <Input
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => set({ starts_at: e.target.value })}
          />
        </div>
        <div>
          <Label>Ends at</Label>
          <Input
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => set({ ends_at: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <Label>Or custom HTML</Label>
          <textarea
            value={form.html_code}
            onChange={(e) => set({ html_code: e.target.value })}
            rows={3}
            className="w-full border border-input bg-background p-2 font-mono text-xs"
          />
        </div>
        <div>
          <Button onClick={create} className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90">
            Create ad
          </Button>
        </div>
      </div>

      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Placement</th>
              <th className="p-3 text-left">Impressions</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">CTR</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted-foreground">
                  No ads yet.
                </td>
              </tr>
            )}
            {(q.data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium">
                  {a.name}
                  {!a.is_active && (
                    <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs">paused</span>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{a.placement}</td>
                <td className="p-3">{a.impressions}</td>
                <td className="p-3">{a.clicks}</td>
                <td className="p-3 text-muted-foreground">
                  {a.impressions ? `${((a.clicks / a.impressions) * 100).toFixed(1)}%` : "—"}
                </td>
                <td className="p-3 text-right">
                  <Button variant="ghost" size="sm" onClick={() => toggle(a)}>
                    {a.is_active ? "Pause" : "Activate"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(a.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
