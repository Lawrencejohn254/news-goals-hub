import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Newspaper, Tag, Users, Eye } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: Dashboard,
});

function Dashboard() {
  const stats = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const [articles, categories, comments, views] = await Promise.all([
        supabase.from("articles").select("id,status,view_count"),
        supabase.from("categories").select("id"),
        supabase.from("comments").select("id"),
        supabase.from("articles").select("view_count"),
      ]);
      const published = (articles.data ?? []).filter((a) => a.status === "published").length;
      const drafts = (articles.data ?? []).filter((a) => a.status === "draft").length;
      const totalViews = (views.data ?? []).reduce((s, r) => s + (r.view_count ?? 0), 0);
      return {
        articles: articles.data?.length ?? 0,
        published,
        drafts,
        categories: categories.data?.length ?? 0,
        comments: comments.data?.length ?? 0,
        totalViews,
      };
    },
  });

  const recent = useQuery({
    queryKey: ["admin", "recent-articles"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("id,title,status,updated_at")
        .order("updated_at", { ascending: false })
        .limit(6);
      return data ?? [];
    },
  });

  const s = stats.data;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-black">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Newsroom overview</p>
        </div>
        <Link
          to="/admin/articles/new"
          className="bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)]/90"
        >
          + New article
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={<Newspaper size={20} />} label="Published" value={s?.published ?? 0} />
        <StatCard icon={<Newspaper size={20} />} label="Drafts" value={s?.drafts ?? 0} />
        <StatCard icon={<Tag size={20} />} label="Categories" value={s?.categories ?? 0} />
        <StatCard icon={<Eye size={20} />} label="Total views" value={s?.totalViews ?? 0} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 font-serif text-xl font-bold">Recently edited</h2>
        <div className="border border-border bg-background">
          {(recent.data ?? []).length === 0 && (
            <p className="p-6 text-sm text-muted-foreground">No articles yet.</p>
          )}
          {(recent.data ?? []).map((a) => (
            <Link
              key={a.id}
              to="/admin/articles/$id"
              params={{ id: a.id }}
              className="flex items-center justify-between border-b border-border p-4 last:border-b-0 hover:bg-muted"
            >
              <span className="font-medium">{a.title}</span>
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                {a.status}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="border border-border bg-background p-5">
      <div className="flex items-center gap-2 text-muted-foreground">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest">{label}</span>
      </div>
      <div className="mt-2 font-serif text-3xl font-black">{value.toLocaleString()}</div>
    </div>
  );
}
