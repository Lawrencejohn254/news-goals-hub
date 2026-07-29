import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/articles")({
  component: ArticlesList,
});

function ArticlesList() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["admin", "articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id,title,slug,status,published_at,updated_at,view_count,is_featured")
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const remove = async (id: string) => {
    if (!confirm("Delete this article?")) return;
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "articles"] });
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-black">Articles</h1>
        <Link
          to="/admin/articles/new"
          className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
        >
          + New article
        </Link>
      </div>

      <div className="border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Published</th>
              <th className="p-3 text-left">Views</th>
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
                  No articles yet.
                </td>
              </tr>
            )}
            {(q.data ?? []).map((a) => (
              <tr key={a.id} className="border-b border-border last:border-b-0">
                <td className="p-3">
                  <Link
                    to="/admin/articles/$id"
                    params={{ id: a.id }}
                    className="font-medium hover:text-[var(--brand)]"
                  >
                    {a.title}
                  </Link>
                  {a.is_featured && (
                    <span className="ml-2 rounded bg-[var(--brand)]/10 px-2 py-0.5 text-xs text-[var(--brand)]">
                      Featured
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={
                      "rounded px-2 py-0.5 text-xs font-semibold uppercase " +
                      (a.status === "published"
                        ? "bg-green-100 text-green-800"
                        : a.status === "draft"
                          ? "bg-muted text-muted-foreground"
                          : "bg-yellow-100 text-yellow-800")
                    }
                  >
                    {a.status}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground">
                  {a.published_at ? formatDate(a.published_at) : "—"}
                </td>
                <td className="p-3 text-muted-foreground">{a.view_count ?? 0}</td>
                <td className="p-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(a.id)}
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
