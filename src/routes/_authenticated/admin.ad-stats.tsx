import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { AD_TZ } from "@/lib/ad-time";

export const Route = createFileRoute("/_authenticated/admin/ad-stats")({
  component: AdStats,
});

type Row = {
  day: string;
  ad_id: string;
  device: string;
  country: string;
  impressions: number;
  clicks: number;
};

type RpcClient = {
  rpc: (fn: string, args?: object) => Promise<{ data: unknown; error: { message: string } | null }>;
};

const RANGES = [7, 30, 90] as const;

const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: AD_TZ }); // -> 2026-10-14
const dayKey = (d: Date) => dayFmt.format(d);

const regionNames = (() => {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" });
  } catch {
    return null;
  }
})();
function countryName(code: string) {
  if (code === "??") return "Unknown";
  try {
    return regionNames?.of(code) ?? code;
  } catch {
    return code;
  }
}

const ctr = (clicks: number, impressions: number) =>
  impressions ? `${((clicks / impressions) * 100).toFixed(2)}%` : "—";

const csvCell = (v: string | number) => `"${String(v).replace(/"/g, '""')}"`;

function AdStats() {
  const [days, setDays] = useState<number>(30);

  const statsQ = useQuery({
    queryKey: ["admin", "ad-stats", days],
    queryFn: async () => {
      const { data, error } = await (supabase as unknown as RpcClient).rpc("ad_stats", { p_days: days });
      if (error) throw new Error(error.message);
      return ((data as Row[] | null) ?? []).map((r) => ({
        ...r,
        impressions: Number(r.impressions),
        clicks: Number(r.clicks),
      }));
    },
  });

  const adsQ = useQuery({
    queryKey: ["admin", "ad-stats", "ads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("ads").select("id, name, placement");
      if (error) throw error;
      return data ?? [];
    },
  });

  const agg = useMemo(() => {
    const rows = statsQ.data ?? [];
    const ads = adsQ.data ?? [];

    // Trend: every day in range, including days with no events
    const byDay = new Map<string, { day: string; impressions: number; clicks: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const key = dayKey(new Date(Date.now() - i * 86_400_000));
      byDay.set(key, { day: key, impressions: 0, clicks: 0 });
    }
    const byAd = new Map<string, { impressions: number; clicks: number }>();
    const byDevice = new Map<string, { impressions: number; clicks: number }>();
    const byCountry = new Map<string, { impressions: number; clicks: number }>();
    const byDayAd = new Map<string, { day: string; ad_id: string; impressions: number; clicks: number }>();

    const add = (m: Map<string, { impressions: number; clicks: number }>, k: string, r: Row) => {
      const cur = m.get(k) ?? { impressions: 0, clicks: 0 };
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      m.set(k, cur);
    };

    let impressions = 0;
    let clicks = 0;
    for (const r of rows) {
      impressions += r.impressions;
      clicks += r.clicks;
      const d = byDay.get(r.day);
      if (d) {
        d.impressions += r.impressions;
        d.clicks += r.clicks;
      }
      add(byAd, r.ad_id, r);
      add(byDevice, r.device, r);
      add(byCountry, r.country, r);

      const k = `${r.day}|${r.ad_id}`;
      const cur = byDayAd.get(k) ?? { day: r.day, ad_id: r.ad_id, impressions: 0, clicks: 0 };
      cur.impressions += r.impressions;
      cur.clicks += r.clicks;
      byDayAd.set(k, cur);
    }

    const perAd = ads
      .map((a) => ({ ...a, ...(byAd.get(a.id) ?? { impressions: 0, clicks: 0 }) }))
      .sort((a, b) => b.impressions - a.impressions);

    const sortList = (m: Map<string, { impressions: number; clicks: number }>) =>
      [...m.entries()].map(([key, v]) => ({ key, ...v })).sort((a, b) => b.impressions - a.impressions);

    return {
      impressions,
      clicks,
      trend: [...byDay.values()],
      perAd,
      devices: sortList(byDevice),
      countries: sortList(byCountry).slice(0, 8),
      dailyByAd: [...byDayAd.values()],
    };
  }, [statsQ.data, adsQ.data, days]);

  const exportCsv = () => {
    const names = new Map((adsQ.data ?? []).map((a) => [a.id, a]));
    const lines = [["Date", "Ad", "Placement", "Impressions", "Clicks", "CTR"].map(csvCell).join(",")];
    for (const r of [...agg.dailyByAd].sort((a, b) => a.day.localeCompare(b.day))) {
      const ad = names.get(r.ad_id);
      lines.push(
        [r.day, ad?.name ?? r.ad_id, ad?.placement ?? "", r.impressions, r.clicks, ctr(r.clicks, r.impressions)]
          .map(csvCell)
          .join(","),
      );
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ad-stats-last-${days}-days.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loading = statsQ.isLoading || adsQ.isLoading;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-black">Ad stats</h1>
          <Link to="/admin/ads" className="text-sm text-muted-foreground hover:underline">
            ← Back to ads
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="h-10 border border-input bg-background px-3 text-sm"
            aria-label="Date range"
          >
            {RANGES.map((r) => (
              <option key={r} value={r}>
                Last {r} days
              </option>
            ))}
          </select>
          <Button variant="outline" onClick={exportCsv} disabled={loading || !agg.dailyByAd.length}>
            Export CSV
          </Button>
        </div>
      </div>

      {statsQ.error && (
        <p className="mb-4 border border-destructive/40 p-3 text-sm text-destructive">
          Could not load stats: {(statsQ.error as Error).message}
        </p>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Impressions", agg.impressions.toLocaleString()],
          ["Clicks", agg.clicks.toLocaleString()],
          ["CTR", ctr(agg.clicks, agg.impressions)],
        ].map(([label, value]) => (
          <div key={label} className="border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{loading ? "…" : value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 border border-border bg-background p-4">
        <p className="mb-3 text-sm font-medium">Daily trend (Nairobi time)</p>
        <div style={{ width: "100%", height: 280 }}>
          <ResponsiveContainer>
            <LineChart data={agg.trend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} tickFormatter={(d: string) => d.slice(5)} />
              <YAxis yAxisId="left" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#64748b" strokeWidth={2} dot={false} />
              <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#dc2626" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mb-6 overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/50 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Ad</th>
              <th className="p-3 text-left">Placement</th>
              <th className="p-3 text-right">Impressions</th>
              <th className="p-3 text-right">Clicks</th>
              <th className="p-3 text-right">CTR</th>
            </tr>
          </thead>
          <tbody>
            {agg.perAd.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No ads yet.
                </td>
              </tr>
            )}
            {agg.perAd.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-b-0">
                <td className="p-3 font-medium">{a.name}</td>
                <td className="p-3 text-muted-foreground">{a.placement}</td>
                <td className="p-3 text-right">{a.impressions.toLocaleString()}</td>
                <td className="p-3 text-right">{a.clicks.toLocaleString()}</td>
                <td className="p-3 text-right text-muted-foreground">{ctr(a.clicks, a.impressions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "By device", list: agg.devices, label: (k: string) => k.charAt(0).toUpperCase() + k.slice(1) },
          { title: "Top countries", list: agg.countries, label: countryName },
        ].map((block) => (
          <div key={block.title} className="border border-border bg-background">
            <p className="border-b border-border p-3 text-sm font-medium">{block.title}</p>
            <table className="w-full text-sm">
              <tbody>
                {block.list.length === 0 && (
                  <tr>
                    <td className="p-4 text-center text-muted-foreground">No data yet.</td>
                  </tr>
                )}
                {block.list.map((r) => (
                  <tr key={r.key} className="border-b border-border last:border-b-0">
                    <td className="p-3">{block.label(r.key)}</td>
                    <td className="p-3 text-right">{r.impressions.toLocaleString()} views</td>
                    <td className="p-3 text-right text-muted-foreground">{r.clicks.toLocaleString()} clicks</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Impressions count when an ad is 50% visible for 1 second, once per visitor session. Clicks are counted
        through the /r/ redirect. Bots and repeat clicks within 5 minutes are ignored. Stats only include events
        recorded since tracking was switched on, so older totals in the ads table may be higher.
      </p>
    </div>
  );
}