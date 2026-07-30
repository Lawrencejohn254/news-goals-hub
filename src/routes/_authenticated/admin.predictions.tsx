import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { fetchPredictions } from "@/lib/football";
import { ResultBadge } from "@/components/site/FootballBits";

export const Route = createFileRoute("/_authenticated/admin/predictions")({
  component: PredictionsAdmin,
});

function PredictionsAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "predictions"],
    queryFn: () => fetchPredictions({ published: false, limit: 200 }),
  });

  const setResult = async (id: string, result: "pending" | "won" | "lost" | "void") => {
    const { error } = await supabase.from("predictions").update({ result }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Result updated");
    qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this prediction?")) return;
    const { error } = await supabase.from("predictions").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    qc.invalidateQueries({ queryKey: ["admin", "predictions"] });
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-black">Predictions</h1>
        <Link
          to="/admin/predictions/new"
          className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
        >
          + New prediction
        </Link>
      </div>

      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Tip</th>
              <th className="p-3 text-left">State</th>
              <th className="p-3 text-left">Result</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            )}
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No predictions yet.
                </td>
              </tr>
            )}
            {(q.data ?? []).map((p) => (
              <tr key={p.id} className="border-b border-border last:border-b-0">
                <td className="p-3">
                  <Link
                    to="/admin/predictions/$id"
                    params={{ id: p.id }}
                    className="font-medium hover:text-[var(--brand)]"
                  >
                    {p.title}
                  </Link>
                  {p.is_featured && (
                    <span className="ml-2 rounded bg-[var(--brand)]/10 px-2 py-0.5 text-xs text-[var(--brand)]">
                      Featured
                    </span>
                  )}
                </td>
                <td className="p-3 text-muted-foreground">{p.tip}</td>
                <td className="p-3">
                  <span className="text-xs font-semibold uppercase">
                    {p.is_published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="p-3">
                  <select
                    value={p.result}
                    onChange={(e) => setResult(p.id, e.target.value as "pending")}
                    className="border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="pending">pending</option>
                    <option value="won">won</option>
                    <option value="lost">lost</option>
                    <option value="void">void</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(p.id)}
                    className="text-destructive hover:text-destructive"
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
