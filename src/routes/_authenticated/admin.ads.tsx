import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { db } from "@/lib/db";
import { AD_PLACEMENTS, type Ad } from "@/lib/site";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdPreview } from "@/components/admin/AdPreview";
import {
  checkImageForPlacement,
  describeSpec,
  getPlacementSpec,
  maxUploadWidth,
} from "@/lib/ad-placements";
import { compressToWebp, type CompressedImage } from "@/lib/image-compress";
import {
  AD_TZ,
  effectiveStatus,
  formatNairobi,
  nairobiInputToISO,
  publishStatus,
  type AdStatus,
} from "@/lib/ad-time";

export const Route = createFileRoute("/_authenticated/admin/ads")({
  component: AdsAdmin,
});

type AdRow = Ad & {
  status?: string | null;
  weight?: number | null;
  target_countries?: string[] | null;
  target_devices?: string[] | null;
  target_sections?: string[] | null;
  frequency_cap?: number | null;
  is_fallback?: boolean | null;
};

type CampaignOption = {
  id: string;
  name: string;
  advertisers: { name: string } | null;
};

const DEVICES = ["mobile", "tablet", "desktop"] as const;

const COUNTRY_PRESETS: { label: string; codes: string }[] = [
  { label: "East Africa", codes: "KE, UG, TZ, RW, BI, SS, ET" },
  { label: "West Africa", codes: "NG, GH, SN, CI, SL, LR, GM" },
  { label: "Southern Africa", codes: "ZA, ZM, ZW, BW, NA, MW, MZ" },
];

const emptyAd = {
  name: "",
  placement: AD_PLACEMENTS[0] as string,
  campaign_id: "",
  save_as: "active" as "draft" | "active",
  image_url: "",
  target_url: "",
  html_code: "",
  starts_at: "",
  ends_at: "",
  weight: "1",
  countries: "",
  devices: [] as string[],
  sections: "",
  frequency_cap: "",
  is_fallback: false,
};

const STATUS_STYLES: Record<AdStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  paused: "bg-amber-100 text-amber-800",
  expired: "bg-red-100 text-red-800",
};

function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

const parseCsv = (v: string) =>
  [...new Set(v.split(",").map((s) => s.trim()).filter(Boolean))];

function targetingSummary(a: AdRow): string {
  const parts: string[] = [];
  if (a.is_fallback) parts.push("fallback");
  if (a.target_countries?.length) parts.push(a.target_countries.join(", "));
  if (a.target_devices?.length) parts.push(a.target_devices.join("/"));
  if (a.target_sections?.length) parts.push(`sections: ${a.target_sections.join(", ")}`);
  if (a.weight && a.weight > 1) parts.push(`weight ${a.weight}`);
  if (a.frequency_cap) parts.push(`max ${a.frequency_cap}/day`);
  return parts.join(" · ");
}

function AdsAdmin() {
  const qc = useQueryClient();
  const [form, setForm] = useState(emptyAd);
  const [image, setImage] = useState<(CompressedImage & { previewUrl: string }) | null>(null);
  const [processing, setProcessing] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const set = (patch: Partial<typeof emptyAd>) => setForm((f) => ({ ...f, ...patch }));

  const spec = useMemo(() => getPlacementSpec(form.placement), [form.placement]);

  // Re-check the picked image whenever the placement changes.
  const imageCheck = useMemo(
    () => (image ? checkImageForPlacement(image.origWidth, image.origHeight, spec) : null),
    [image, spec],
  );

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.previewUrl);
    };
  }, [image]);

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

  const campaignsQ = useQuery({
    queryKey: ["admin", "campaign-options"],
    queryFn: async () => {
      const { data, error } = await db
        .from("campaigns")
        .select("id, name, advertisers(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as CampaignOption[];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "ads"] });

  const clearImage = () => {
    setImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onPickFile = async (file: File | undefined) => {
    if (!file) return;
    if (!/^image\/(png|jpe?g|webp)$/.test(file.type)) {
      toast.error("Use a PNG, JPG or WebP image");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("That image is over 10 MB. Pick a smaller one.");
      return;
    }
    setProcessing(true);
    try {
      const result = await compressToWebp(file, maxUploadWidth(spec), spec.maxKB * 1024);
      setImage({ ...result, previewUrl: URL.createObjectURL(result.blob) });
      set({ image_url: "" });
      const saved = Math.max(0, Math.round((1 - result.blob.size / result.originalSize) * 100));
      toast.success(`Image ready: ${Math.round(result.blob.size / 1024)} KB (${saved}% smaller)`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read that image");
    } finally {
      setProcessing(false);
    }
  };

  const toggleDevice = (d: string) =>
    set({ devices: form.devices.includes(d) ? form.devices.filter((x) => x !== d) : [...form.devices, d] });

  const validate = (): string | null => {
    if (!form.name.trim()) return "Give the ad a name";

    const hasHtml = form.html_code.trim().length > 0;
    const hasImage = !!image || form.image_url.trim().length > 0;

    if (!hasHtml) {
      if (!hasImage) return "Upload an image or add custom HTML";
      if (!form.target_url.trim()) return "Add a target URL so the image links somewhere";
    }
    if (form.image_url.trim() && !isHttpUrl(form.image_url.trim())) return "Image URL must start with http:// or https://";
    if (form.target_url.trim() && !isHttpUrl(form.target_url.trim())) return "Target URL must start with http:// or https://";
    if (imageCheck?.error) return imageCheck.error;
    if (image && image.blob.size > spec.maxKB * 1024) {
      return `Image is still over ${spec.maxKB} KB after compression. Try a simpler image.`;
    }

    const start = nairobiInputToISO(form.starts_at);
    const end = nairobiInputToISO(form.ends_at);
    if (end && new Date(end) < new Date() && form.save_as === "active") return "End date is already in the past";
    if (start && end && new Date(end) <= new Date(start)) return "End date must be after the start date";

    const weight = Number(form.weight);
    if (!Number.isInteger(weight) || weight < 1 || weight > 100) return "Weight must be a whole number from 1 to 100";

    if (form.frequency_cap.trim()) {
      const cap = Number(form.frequency_cap);
      if (!Number.isInteger(cap) || cap < 1) return "Frequency cap must be a whole number of 1 or more";
    }

    const bad = parseCsv(form.countries).find((c) => !/^[A-Za-z]{2}$/.test(c));
    if (bad) return `"${bad}" is not a 2-letter country code (use codes like KE, NG, GH)`;

    const badSection = parseCsv(form.sections).find((s) => !/^[A-Za-z0-9_-]+$/.test(s));
    if (badSection) return `"${badSection}" is not a valid section slug (letters, numbers, - and _ only)`;

    return null;
  };

  const create = async () => {
    const problem = validate();
    if (problem) return toast.error(problem);

    setSaving(true);
    try {
      let imageUrl = form.image_url.trim() || null;

      if (image) {
        const folder = form.placement.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const path = `${folder}/${crypto.randomUUID()}.${image.ext}`;
        const { error: upErr } = await supabase.storage
          .from("ad-images")
          .upload(path, image.blob, { contentType: image.blob.type, cacheControl: "31536000" });
        if (upErr) throw upErr;
        imageUrl = supabase.storage.from("ad-images").getPublicUrl(path).data.publicUrl;
      }

      const startsISO = nairobiInputToISO(form.starts_at);
      const endsISO = nairobiInputToISO(form.ends_at);
      const countries = parseCsv(form.countries).map((c) => c.toUpperCase());
      const sections = parseCsv(form.sections).map((s) => s.toLowerCase());

      // Uses the untyped client so newer columns never cause type errors.
      const { error } = await db.from("ads").insert({
        name: form.name.trim(),
        campaign_id: form.campaign_id || null,
        placement: form.placement,
        image_url: imageUrl,
        target_url: form.target_url.trim() || null,
        html_code: form.html_code.trim() || null,
        starts_at: startsISO,
        ends_at: endsISO,
        status: form.save_as === "draft" ? "draft" : publishStatus(startsISO),
        weight: Number(form.weight),
        target_countries: countries.length ? countries : null,
        target_devices: form.devices.length ? form.devices : null,
        target_sections: sections.length ? sections : null,
        frequency_cap: form.frequency_cap.trim() ? Number(form.frequency_cap) : null,
        is_fallback: form.is_fallback,
      });
      if (error) throw new Error(error.message);

      toast.success(form.save_as === "draft" ? "Draft saved" : "Ad created");
      setForm(emptyAd);
      clearImage();
      refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not create the ad");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (ad: AdRow) => {
    const current = effectiveStatus(ad);
    const next: AdStatus =
      current === "active" || current === "scheduled" ? "paused" : publishStatus(ad.starts_at);
    const { error } = await db.from("ads").update({ status: next }).eq("id", ad.id);
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

  const previewImage = image?.previewUrl ?? form.image_url;
  const rows = (q.data ?? []) as unknown as AdRow[];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl font-black">Ads</h1>
        <div className="flex items-center gap-4">
          <Link to="/admin/ad-stats" className="text-sm underline">
            View stats →
          </Link>
          <Link to="/admin/campaigns" className="text-sm underline">
            Campaigns →
          </Link>
        </div>
      </div>

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
          <p className="mt-1 text-xs text-muted-foreground">{describeSpec(spec)}</p>
        </div>

        <div className="md:col-span-2">
          <Label>Image</Label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={(e) => onPickFile(e.target.files?.[0])}
              className="text-sm file:mr-3 file:border file:border-input file:bg-background file:px-3 file:py-2 file:text-sm"
            />
            {processing && <span className="text-xs text-muted-foreground">Compressing…</span>}
            {image && !processing && (
              <>
                <span className="text-xs text-muted-foreground">
                  {image.origWidth}×{image.origHeight} → {image.width}×{image.height} WebP,{" "}
                  {Math.round(image.blob.size / 1024)} KB
                </span>
                <Button type="button" variant="ghost" size="sm" onClick={clearImage}>
                  Remove
                </Button>
              </>
            )}
          </div>
          {imageCheck?.error && <p className="mt-1 text-xs text-destructive">{imageCheck.error}</p>}
          {imageCheck?.warning && <p className="mt-1 text-xs text-amber-700">{imageCheck.warning}</p>}
          {!image && (
            <div className="mt-2">
              <Label className="text-xs text-muted-foreground">Or paste an image URL</Label>
              <Input
                value={form.image_url}
                onChange={(e) => set({ image_url: e.target.value })}
                placeholder="https://"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <Label>Target URL</Label>
          <Input
            value={form.target_url}
            onChange={(e) => set({ target_url: e.target.value })}
            placeholder="https://advertiser.com/landing-page"
          />
        </div>

        <div className="md:col-span-2">
          <Label>Campaign (optional)</Label>
          <select
            value={form.campaign_id}
            onChange={(e) => set({ campaign_id: e.target.value })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            <option value="">No campaign</option>
            {(campaignsQ.data ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.advertisers?.name ? `${c.advertisers.name} — ` : ""}
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <Label>Starts at ({AD_TZ})</Label>
          <Input
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => set({ starts_at: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">Leave empty to start immediately.</p>
        </div>
        <div>
          <Label>Ends at ({AD_TZ})</Label>
          <Input
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => set({ ends_at: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">Leave empty to run until paused.</p>
        </div>

        {/* Delivery & targeting */}
        <div className="border-t border-border pt-3 md:col-span-2">
          <p className="text-sm font-medium">Delivery &amp; targeting</p>
          <p className="text-xs text-muted-foreground">
            Leave targeting empty to show the ad to everyone. An ad with targeting is skipped when that detail is
            unknown for the visitor.
          </p>
        </div>

        <div className="md:col-span-2">
          <Label>Countries</Label>
          <Input
            value={form.countries}
            onChange={(e) => set({ countries: e.target.value })}
            placeholder="KE, UG, TZ (2-letter codes, empty = everywhere)"
          />
          <div className="mt-1 flex flex-wrap gap-2">
            {COUNTRY_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => set({ countries: p.codes })}
                className="border border-input px-2 py-0.5 text-xs text-muted-foreground hover:bg-muted"
              >
                {p.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => set({ countries: "" })}
              className="px-2 py-0.5 text-xs text-muted-foreground underline"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <Label>Devices</Label>
          <div className="flex h-10 items-center gap-4 text-sm">
            {DEVICES.map((d) => (
              <label key={d} className="flex items-center gap-1.5">
                <input type="checkbox" checked={form.devices.includes(d)} onChange={() => toggleDevice(d)} />
                {d}
              </label>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">None ticked = all devices.</p>
        </div>

        <div>
          <Label>Site sections</Label>
          <Input
            value={form.sections}
            onChange={(e) => set({ sections: e.target.value })}
            placeholder="politics, business, sports (category slugs)"
          />
        </div>

        <div>
          <Label>Weight (1–100)</Label>
          <Input
            type="number"
            min="1"
            max="100"
            step="1"
            value={form.weight}
            onChange={(e) => set({ weight: e.target.value })}
          />
          <p className="mt-1 text-xs text-muted-foreground">
            When ads compete for a slot, weight 3 shows about 3x as often as weight 1.
          </p>
        </div>

        <div>
          <Label>Max views per visitor per day</Label>
          <Input
            type="number"
            min="1"
            step="1"
            value={form.frequency_cap}
            onChange={(e) => set({ frequency_cap: e.target.value })}
            placeholder="No limit"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              className="mt-1"
              checked={form.is_fallback}
              onChange={(e) => set({ is_fallback: e.target.checked })}
            />
            <span>
              Fallback ad
              <span className="block text-xs text-muted-foreground">
                Only shown when no paid ad is eligible for the slot (use for house ads, such as your newsletter).
              </span>
            </span>
          </label>
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

        <div className="md:col-span-2">
          <AdPreview
            spec={spec}
            imageUrl={previewImage}
            html={form.html_code}
            targetUrl={form.target_url}
          />
        </div>

        <div className="flex items-center gap-3 md:col-span-2">
          <select
            value={form.save_as}
            onChange={(e) => set({ save_as: e.target.value as "draft" | "active" })}
            className="h-10 border border-input bg-background px-3 text-sm"
            aria-label="Save as"
          >
            <option value="active">Publish</option>
            <option value="draft">Save as draft</option>
          </select>
          <Button
            onClick={create}
            disabled={saving || processing}
            className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
          >
            {saving ? "Saving…" : form.save_as === "draft" ? "Save draft" : "Create ad"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Placement</th>
              <th className="p-3 text-left">Schedule (Nairobi)</th>
              <th className="p-3 text-left">Impressions</th>
              <th className="p-3 text-left">Clicks</th>
              <th className="p-3 text-left">CTR</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-muted-foreground">
                  No ads yet.
                </td>
              </tr>
            )}
            {rows.map((a) => {
              const status = effectiveStatus(a);
              const running = status === "active" || status === "scheduled";
              const summary = targetingSummary(a);
              return (
                <tr key={a.id} className="border-b border-border last:border-b-0">
                  <td className="p-3">
                    <div className="font-medium">{a.name}</div>
                    {summary && <div className="text-xs text-muted-foreground">{summary}</div>}
                  </td>
                  <td className="p-3">
                    <span className={`rounded px-2 py-0.5 text-xs ${STATUS_STYLES[status]}`}>{status}</span>
                  </td>
                  <td className="p-3 text-muted-foreground">{a.placement}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    <div>{formatNairobi(a.starts_at)}</div>
                    <div>{formatNairobi(a.ends_at)}</div>
                  </td>
                  <td className="p-3">{a.impressions}</td>
                  <td className="p-3">{a.clicks}</td>
                  <td className="p-3 text-muted-foreground">
                    {a.impressions ? `${((a.clicks / a.impressions) * 100).toFixed(1)}%` : "—"}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <Button variant="ghost" size="sm" onClick={() => toggle(a)}>
                      {running ? "Pause" : status === "draft" ? "Publish" : "Activate"}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}