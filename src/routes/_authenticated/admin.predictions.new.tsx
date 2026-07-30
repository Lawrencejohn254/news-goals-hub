import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  PredictionForm,
  emptyDraft,
  usePredictionSave,
  type PredictionDraft,
} from "@/components/admin/PredictionForm";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/predictions/new")({
  component: NewPrediction,
});

function NewPrediction() {
  const [draft, setDraft] = useState<PredictionDraft>(emptyDraft);
  const set = (patch: Partial<PredictionDraft>) => setDraft((d) => ({ ...d, ...patch }));
  const { saving, create } = usePredictionSave();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">New prediction</h1>
      <PredictionForm draft={draft} set={set} />
      <div className="mt-6 flex gap-3">
        <Button variant="outline" disabled={saving} onClick={() => create(draft)}>
          Save
        </Button>
        <Button
          disabled={saving}
          onClick={() => create({ ...draft, is_published: true })}
          className="bg-[var(--brand)] text-white hover:bg-[var(--brand)]/90"
        >
          Publish
        </Button>
      </div>
    </div>
  );
}
