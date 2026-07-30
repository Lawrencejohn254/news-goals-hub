import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/format";
import { fetchMatches, matchLabel } from "@/lib/football";
import { RichTextEditor } from "@/components/site/RichTextEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export type PredictionDraft = {
  match_id: string;
  title: string;
  slug: string;
  tip: string;
  confidence: number;
  odds: string;
  predicted_home_score: string;
  predicted_away_score: string;
  analysis: string;
  home_form: string;
  away_form: string;
  head_to_head: string;
  key_stats: string;
  is_published: boolean;
  is_featured: boolean;
  seo_title: string;
  seo_description: string;
};

export const emptyDraft: PredictionDraft = {
  match_id: "",
  title: "",
  slug: "",
  tip: "",
  confidence: 3,
  odds: "",
  predicted_home_score: "",
  predicted_away_score: "",
  analysis: "",
  home_form: "",
  away_form: "",
  head_to_head: "",
  key_stats: "",
  is_published: false,
  is_featured: false,
  seo_title: "",
  seo_description: "",
};

export function toRow(d: PredictionDraft) {
  return {
    match_id: d.match_id,
    title: d.title.trim(),
    slug: d.slug.trim() || slugify(d.title),
    tip: d.tip.trim(),
    confidence: Math.min(5, Math.max(1, Number(d.confidence) || 3)),
    odds: d.odds ? Number(d.odds) : null,
    predicted_home_score: d.predicted_home_score === "" ? null : Number(d.predicted_home_score),
    predicted_away_score: d.predicted_away_score === "" ? null : Number(d.predicted_away_score),
    analysis: d.analysis,
    home_form: d.home_form || null,
    away_form: d.away_form || null,
    head_to_head: d.head_to_head || null,
    key_stats: d.key_stats || null,
    is_published: d.is_published,
    is_featured: d.is_featured,
    seo_title: d.seo_title || null,
    seo_description: d.seo_description || null,
  };
}

export function PredictionForm({
  draft,
  set,
}: {
  draft: PredictionDraft;
  set: (patch: Partial<PredictionDraft>) => void;
}) {
  const matches = useQuery({ queryKey: ["admin", "matches"], queryFn: () => fetchMatches(200) });

  return (
    <div className="space-y-4 border border-border bg-background p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label htmlFor="match">Match</Label>
          <select
            id="match"
            value={draft.match_id}
            onChange={(e) => set({ match_id: e.target.value })}
            className="h-10 w-full border border-input bg-background px-3 text-sm"
          >
            <option value="">Select a fixture…</option>
            {(matches.data ?? []).map((m) => (
              <option key={m.id} value={m.id}>
                {matchLabel(m)} — {new Date(m.kickoff_at).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="tip">Tip</Label>
          <Input
            id="tip"
            value={draft.tip}
            onChange={(e) => set({ tip: e.target.value })}
            placeholder="Home win & over 2.5 goals"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="ptitle">Title</Label>
        <Input
          id="ptitle"
          value={draft.title}
          onChange={(e) => {
            set({ title: e.target.value });
            if (!draft.slug) set({ slug: slugify(e.target.value) });
          }}
          className="text-lg font-semibold"
          placeholder="Arsenal vs Liverpool prediction, tips and odds"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div>
          <Label htmlFor="pslug">Slug</Label>
          <Input id="pslug" value={draft.slug} onChange={(e) => set({ slug: slugify(e.target.value) })} />
        </div>
        <div>
          <Label htmlFor="conf">Confidence (1–5)</Label>
          <Input
            id="conf"
            type="number"
            min={1}
            max={5}
            value={draft.confidence}
            onChange={(e) => set({ confidence: Number(e.target.value) })}
          />
        </div>
        <div>
          <Label htmlFor="odds">Odds</Label>
          <Input id="odds" value={draft.odds} onChange={(e) => set({ odds: e.target.value })} placeholder="2.10" />
        </div>
        <div>
          <Label>Correct score</Label>
          <div className="flex items-center gap-2">
            <Input
              value={draft.predicted_home_score}
              onChange={(e) => set({ predicted_home_score: e.target.value })}
              placeholder="2"
            />
            <span>–</span>
            <Input
              value={draft.predicted_away_score}
              onChange={(e) => set({ predicted_away_score: e.target.value })}
              placeholder="1"
            />
          </div>
        </div>
      </div>

      <div>
        <Label>Analysis</Label>
        <RichTextEditor value={draft.analysis} onChange={(v) => set({ analysis: v })} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Home form" value={draft.home_form} onChange={(v) => set({ home_form: v })} />
        <Field label="Away form" value={draft.away_form} onChange={(v) => set({ away_form: v })} />
        <Field label="Head to head" value={draft.head_to_head} onChange={(v) => set({ head_to_head: v })} />
        <Field label="Key stats" value={draft.key_stats} onChange={(v) => set({ key_stats: v })} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="SEO title" value={draft.seo_title} onChange={(v) => set({ seo_title: v })} rows={1} />
        <Field
          label="SEO description"
          value={draft.seo_description}
          onChange={(v) => set({ seo_description: v })}
        />
      </div>

      <div className="flex flex-wrap gap-6 border-t border-border pt-4">
        <div className="flex items-center gap-3">
          <Switch
            id="pub"
            checked={draft.is_published}
            onCheckedChange={(v) => set({ is_published: v })}
          />
          <Label htmlFor="pub">Published</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="pfeat" checked={draft.is_featured} onCheckedChange={(v) => set({ is_featured: v })} />
          <Label htmlFor="pfeat">Featured</Label>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function usePredictionSave() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const create = async (draft: PredictionDraft) => {
    if (!draft.match_id) return toast.error("Pick a fixture");
    if (!draft.title.trim() || !draft.tip.trim()) return toast.error("Title and tip are required");
    setSaving(true);
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("predictions")
      .insert({ ...toRow(draft), author_id: userData.user!.id })
      .select("id")
      .single();
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Prediction created");
    navigate({ to: "/admin/predictions/$id", params: { id: data.id } });
  };

  const update = async (id: string, draft: PredictionDraft) => {
    setSaving(true);
    const { error } = await supabase.from("predictions").update(toRow(draft)).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
  };

  return { saving, create, update };
}
