import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { attachAuthors } from "@/lib/site";
import { formatDate } from "@/lib/format";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin/comments")({
  component: CommentsAdmin,
});

type Filter = "pending" | "approved" | "all";

function CommentsAdmin() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Filter>("pending");

  const q = useQuery({
    queryKey: ["admin", "comments", filter],
    queryFn: async () => {
      let query = supabase.from("comments").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter === "pending") query = query.eq("is_approved", false);
      if (filter === "approved") query = query.eq("is_approved", true);
      const { data, error } = await query;
      if (error) throw error;
      const withAuthors = await attachAuthors(data ?? []);
      const ids = [...new Set((data ?? []).map((c) => c.article_id))];
      const { data: arts } = ids.length
        ? await supabase.from("articles").select("id,title,slug").in("id", ids)
        : { data: [] as { id: string; title: string; slug: string }[] };
      const map = new Map((arts ?? []).map((a) => [a.id, a]));
      return withAuthors.map((c) => ({ ...c, article: map.get(c.article_id) }));
    },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "comments"] });

  const approve = async (id: string, value: boolean) => {
    const { error } = await supabase.from("comments").update({ is_approved: value }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(value ? "Approved" : "Unapproved");
    refresh();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this comment?")) return;
    const { error } = await supabase.from("comments").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    refresh();
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-black">Comments</h1>
        <div className="flex gap-1 border border-border bg-background p-1 text-sm">
          {(["pending", "approved", "all"] as Filter[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={
                "px-3 py-1 capitalize " +
                (filter === f ? "bg-[var(--ink)] text-white" : "hover:bg-muted")
              }
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="border border-border bg-background">
        {q.isLoading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {q.data?.length === 0 && (
          <p className="p-6 text-center text-muted-foreground">Nothing here.</p>
        )}
        {(q.data ?? []).map((c) => (
          <div key={c.id} className="border-b border-border p-4 last:border-b-0">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{c.author_name}</span>
              <span>·</span>
              <span>{formatDate(c.created_at)}</span>
              {c.article && (
                <>
                  <span>·</span>
                  <span className="truncate">on “{c.article.title}”</span>
                </>
              )}
              <span
                className={
                  "ml-auto rounded px-2 py-0.5 text-xs font-semibold uppercase " +
                  (c.is_approved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800")
                }
              >
                {c.is_approved ? "approved" : "pending"}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm">{c.content}</p>
            <div className="mt-3 flex gap-2">
              <Button size="sm" variant="outline" onClick={() => approve(c.id, !c.is_approved)}>
                {c.is_approved ? "Unapprove" : "Approve"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => remove(c.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
