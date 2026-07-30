import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  PredictionForm,
  emptyDraft,
  usePredictionSave,
  type PredictionDraft,
} from "@/components/admin/PredictionForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/predictions/$id")({
  component: EditPrediction,
});

function EditPrediction() {
  const { id } = Route.useParams();
  const [draft, setDraft] = useState<PredictionDraft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const set = (patch: Partial<PredictionDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const { saving, update } = usePredictionSave();

  useEffect(() => {
    supabase
      .from("predictions")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        if (data) {
          setDraft({
            match_id: data.match_id,
            title: data.title,
            slug: data.slug,
            tip: data.tip,
            confidence: data.confidence,
            odds: data.odds != null ? String(data.odds) : "",
            predicted_home_score:
              data.predicted_home_score != null ? String(data.predicted_home_score) : "",
            predicted_away_score:
              data.predicted_away_score != null ? String(data.predicted_away_score) : "",
            analysis: data.analysis ?? "",
            home_form: data.home_form ?? "",
            away_form: data.away_form ?? "",
            head_to_head: data.head_to_head ?? "",
            key_stats: data.key_stats ?? "",
            is_published: data.is_published,
            is_featured: data.is_featured,
            seo_title: data.seo_title ?? "",
            seo_description: data.seo_description ?? "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">Edit prediction</h1>
      <PredictionForm draft={draft} set={set} />
      <div className="mt-6 flex gap-3">
        <Button variant="outline" disabled={saving} onClick={() => update(id, draft)}>
          Save changes
        </Button>
        <Button
          disabled={saving}
          onClick={() => {
            set({ is_published: !draft.is_published });
            update(id, { ...draft, is_published: !draft.is_published });
          }}
          className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
        >
          {draft.is_published ? "Unpublish" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
