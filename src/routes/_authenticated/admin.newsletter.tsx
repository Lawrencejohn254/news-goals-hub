import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/newsletter")({
  component: NewsletterAdmin,
});

function NewsletterAdmin() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("newsletter_subscribers")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data ?? [];
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "subscribers"] });

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("newsletter_subscribers").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this subscriber?")) return;
    const { error } = await supabase.from("newsletter_subscribers").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    refresh();
  };

  const exportCsv = () => {
    const rows = q.data ?? [];
    const csv = [
      "email,status,source,created_at",
      ...rows.map((r) => `${r.email},${r.status},${r.source ?? ""},${r.created_at}`),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscribers.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const active = (q.data ?? []).filter((s) => s.status === "subscribed").length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black">Newsletter</h1>
          <p className="text-sm text-muted-foreground">
            {active} active of {q.data?.length ?? 0} subscribers
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv}>
          Export CSV
        </Button>
      </div>

      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Source</th>
              <th className="p-3 text-left">Joined</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {q.data?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No subscribers yet.
                </td>
              </tr>
            )}
            {(q.data ?? []).map((s) => (
              <tr key={s.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium">{s.email}</td>
                <td className="p-3">
                  <select
                    value={s.status}
                    onChange={(e) => setStatus(s.id, e.target.value)}
                    className="border border-input bg-background px-2 py-1 text-xs"
                  >
                    <option value="subscribed">subscribed</option>
                    <option value="unsubscribed">unsubscribed</option>
                    <option value="bounced">bounced</option>
                  </select>
                </td>
                <td className="p-3 text-muted-foreground">{s.source ?? "—"}</td>
                <td className="p-3 text-muted-foreground">{formatDate(s.created_at)}</td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => remove(s.id)}
                  >
                    Remove
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
