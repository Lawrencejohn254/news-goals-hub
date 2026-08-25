import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchSettings, type SiteSettings } from "@/lib/site";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

// These four columns were added directly via SQL rather than through
// Supabase's type generator, so they aren't in the auto-generated
// SiteSettings type yet — extending it locally here avoids needing to
// hand-edit the large generated types.ts file.
type ExtraSettings = {
  show_view_count: boolean;
  show_published_date: boolean;
  predictions_enabled: boolean;
  whatsapp_url: string | null;
};

type Draft = Omit<SiteSettings, "id" | "updated_at"> & ExtraSettings;

const empty: Draft = {
  site_name: "Dispatch",
  tagline: "",
  description: "",
  logo_url: "",
  twitter_url: "",
  facebook_url: "",
  instagram_url: "",
  youtube_url: "",
  ga_measurement_id: "",
  default_seo_title: "",
  default_seo_description: "",
  show_view_count: false,
  show_published_date: false,
  predictions_enabled: true,
  whatsapp_url: "",
};

function SettingsAdmin() {
  const [draft, setDraft] = useState<Draft>(empty);
  const [saving, setSaving] = useState(false);
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const q = useQuery({ queryKey: ["site-settings"], queryFn: fetchSettings });

  useEffect(() => {
    if (!q.data) return;
    const { id: _id, updated_at: _u, ...rest } = q.data as SiteSettings & ExtraSettings;
    setDraft({ ...empty, ...rest });
  }, [q.data]);

  const save = async () => {
    setSaving(true);
    const payload = { ...draft, id: 1, updated_at: new Date().toISOString() };
    const { error } = q.data
      ? await supabase.from("site_settings").update(payload).eq("id", 1)
      : await supabase.from("site_settings").insert(payload);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Settings saved");
  };

  const field = (key: keyof Draft, label: string, placeholder = "") => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        value={(draft[key] as string) ?? ""}
        placeholder={placeholder}
        onChange={(e) => set({ [key]: e.target.value } as Partial<Draft>)}
      />
    </div>
  );

  const toggle = (key: keyof Draft, label: string, description: string) => (
    <div className="flex items-center justify-between gap-4 border border-border bg-[var(--paper)] p-3">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={Boolean(draft[key])}
        onCheckedChange={(checked) => set({ [key]: checked } as Partial<Draft>)}
      />
    </div>
  );

  return (
    <div className="max-w-3xl">
      <h1 className="mb-6 font-serif text-3xl font-black">Site settings &amp; SEO</h1>

      <section className="mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-serif text-lg font-bold">Identity</h2>
        {field("site_name", "Site name")}
        {field("tagline", "Tagline")}
        <div className="md:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            rows={3}
            value={draft.description ?? ""}
            onChange={(e) => set({ description: e.target.value })}
            className="w-full border border-input bg-background p-2 text-sm"
          />
        </div>
        {field("logo_url", "Logo URL")}
      </section>

      <section className="mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-serif text-lg font-bold">Social</h2>
        {field("twitter_url", "X / Twitter")}
        {field("facebook_url", "Facebook")}
        {field("instagram_url", "Instagram")}
        {field("whatsapp_url", "WhatsApp", "https://wa.me/…")}
        {field("youtube_url", "YouTube")}
      </section>

      <section className="mb-6 space-y-3 border border-border bg-background p-5">
        <h2 className="font-serif text-lg font-bold">Article display</h2>
        {toggle(
          "show_view_count",
          "Show view count on articles",
          "Displays the \"X views\" figure in each article's byline.",
        )}
        {toggle(
          "show_published_date",
          "Show published date on articles",
          "Displays the publish date in each article's byline.",
        )}
      </section>

      <section className="mb-6 space-y-3 border border-border bg-background p-5">
        <h2 className="font-serif text-lg font-bold">Sections</h2>
        {toggle(
          "predictions_enabled",
          "Show Predictions in navigation",
          "Turns the Predictions link on or off in the header and footer. Existing prediction pages stay reachable directly either way.",
        )}
      </section>

      <section className="mb-6 grid gap-4 border border-border bg-background p-5 md:grid-cols-2">
        <h2 className="md:col-span-2 font-serif text-lg font-bold">SEO &amp; analytics</h2>
        {field("default_seo_title", "Default SEO title")}
        {field("ga_measurement_id", "GA measurement ID", "G-XXXXXXX")}
        <div className="md:col-span-2">
          <Label htmlFor="seo_desc">Default SEO description</Label>
          <textarea
            id="seo_desc"
            rows={3}
            value={draft.default_seo_description ?? ""}
            onChange={(e) => set({ default_seo_description: e.target.value })}
            className="w-full border border-input bg-background p-2 text-sm"
          />
        </div>
      </section>

      <Button
        onClick={save}
        disabled={saving}
        className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
      >
        {saving ? "Saving…" : "Save settings"}
      </Button>
    </div>
  );
}