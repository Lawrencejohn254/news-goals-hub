import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/format";

export const Route = createFileRoute("/_authenticated/admin/analytics")({
  component: AnalyticsAdmin,
});

function AnalyticsAdmin() {
  const q = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const { data: views, error } = await supabase
        .from("page_views")
        .select("path,referrer,created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;

      const rows = views ?? [];
      const byDay = new Map<string, number>();
      const byPath = new Map<string, number>();
      const byReferrer = new Map<string, number>();
      for (const v of rows) {
        const day = v.created_at.slice(0, 10);
        byDay.set(day, (byDay.get(day) ?? 0) + 1);
        byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1);
        let ref = "direct";
        if (v.referrer) {
          try {
            ref = new URL(v.referrer).hostname;
          } catch {
            ref = v.referrer.slice(0, 40);
          }
        }
        byReferrer.set(ref, (byReferrer.get(ref) ?? 0) + 1);
      }

      const days: { day: string; count: number }[] = [];
      for (let i = 29; i >= 0; i--) {
        const day = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
        days.push({ day, count: byDay.get(day) ?? 0 });
      }

      const top = (m: Map<string, number>) =>
        [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10);

      const last7 = days.slice(-7).reduce((s, d) => s + d.count, 0);
      const prev7 = days.slice(-14, -7).reduce((s, d) => s + d.count, 0);

      const { data: articles } = await supabase
        .from("articles")
        .select("title,slug,view_count,published_at")
        .eq("status", "published")
        .order("view_count", { ascending: false })
        .limit(10);

      return {
        total: rows.length,
        last7,
        prev7,
        days,
        topPaths: top(byPath),
        topReferrers: top(byReferrer),
        topArticles: articles ?? [],
      };
    },
  });

  const d = q.data;
  const max = Math.max(1, ...(d?.days ?? []).map((x) => x.count));
  const delta = d && d.prev7 ? Math.round(((d.last7 - d.prev7) / d.prev7) * 100) : null;

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl font-black">Analytics</h1>
      {q.isLoading && <p className="text-muted-foreground">Loading…</p>}

      {d && (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Stat label="Views (30 days)" value={d.total} />
            <Stat label="Views (last 7 days)" value={d.last7} />
            <Stat
              label="vs previous 7 days"
              value={delta === null ? 0 : delta}
              suffix={delta === null ? "" : "%"}
            />
          </div>

          <div className="mt-8 border border-border bg-background p-5">
            <h2 className="mb-4 font-serif text-lg font-bold">Daily views</h2>
            <div className="flex h-40 items-end gap-1">
              {d.days.map((x) => (
                <div
                  key={x.day}
                  title={`${x.day}: ${x.count}`}
                  style={{ height: `${(x.count / max) * 100}%` }}
                  className="flex-1 bg-[var(--brand)]/80 hover:bg-[var(--brand)]"
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatDate(d.days[0]?.day)}</span>
              <span>{formatDate(d.days[d.days.length - 1]?.day)}</span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <ListCard title="Top pages" rows={d.topPaths} />
            <ListCard title="Top referrers" rows={d.topReferrers} />
          </div>

          <div className="mt-8 border border-border bg-background">
            <h2 className="border-b border-border p-4 font-serif text-lg font-bold">
              Most-read articles
            </h2>
            {d.topArticles.length === 0 && (
              <p className="p-4 text-sm text-muted-foreground">No published articles yet.</p>
            )}
            {d.topArticles.map((a) => (
              <div
                key={a.slug}
                className="flex items-center justify-between border-b border-border p-3 text-sm last:border-b-0"
              >
                <span className="truncate">{a.title}</span>
                <span className="text-muted-foreground">{a.view_count ?? 0}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stat({ label, value, suffix = "" }: { label: string; value: number; suffix?: string }) {
  return (
    <div className="border border-border bg-background p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 font-serif text-3xl font-black">
        {value.toLocaleString()}
        {suffix}
      </p>
    </div>
  );
}

function ListCard({ title, rows }: { title: string; rows: [string, number][] }) {
  return (
    <div className="border border-border bg-background">
      <h2 className="border-b border-border p-4 font-serif text-lg font-bold">{title}</h2>
      {rows.length === 0 && <p className="p-4 text-sm text-muted-foreground">No data yet.</p>}
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="flex items-center justify-between border-b border-border p-3 text-sm last:border-b-0"
        >
          <span className="truncate">{k}</span>
          <span className="text-muted-foreground">{v}</span>
        </div>
      ))}
    </div>
  );
}
