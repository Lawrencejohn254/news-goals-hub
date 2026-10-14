import { createFileRoute } from "@tanstack/react-router";
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
import { db } from "@/lib/db";
import { AD_TZ, formatNairobi } from "@/lib/ad-time";

export const Route = createFileRoute("/report/$token")({
  component: ReportPage,
  head: () => ({
    meta: [{ title: "Campaign report" }, { name: "robots", content: "noindex, nofollow" }],
  }),
});

type Report = {
  campaign: {
    name: string;
    advertiser: string;
    starts_at: string | null;
    ends_at: string | null;
    impression_goal: number | null;
  };
  total_impressions: number;
  total_clicks: number;
  days: { day: string; impressions: number; clicks: number }[];
  ads: { name: string; placement: string; image_url: string | null; impressions: number; clicks: number }[];
};

const RANGES = [7, 30, 90] as const;
const dayFmt = new Intl.DateTimeFormat("en-CA", { timeZone: AD_TZ });

const ctr = (clicks: number, impressions: number) =>
  impressions ? `${((clicks / impressions) * 100).toFixed(2)}%` : "—";

function ReportPage() {
  const { token } = Route.useParams();
  const [days, setDays] = useState<number>(30);

  const q = useQuery({
    queryKey: ["campaign-report", token, days],
    retry: false,
    queryFn: async () => {
      const { data, error } = await db.rpc("campaign_report", { p_token: token, p_days: days });
      if (error) throw new Error(error.message);
      return (data as Report | null) ?? null;
    },
  });

  const trend = useMemo(() => {
    const map = new Map<string, { day: string; impressions: number; clicks: number }>();
    for (let i = days - 1; i >= 0; i--) {
      const key = dayFmt.format(new Date(Date.now() - i * 86_400_000));
      map.set(key, { day: key, impressions: 0, clicks: 0 });
    }
    for (const d of q.data?.days ?? []) {
      const row = map.get(d.day);
      if (row) {
        row.impressions = Number(d.impressions);
        row.clicks = Number(d.clicks);
      }
    }
    return [...map.values()];
  }, [q.data, days]);

  if (q.isLoading) {
    return <div className="mx-auto max-w-4xl p-6 text-sm text-muted-foreground">Loading report…</div>;
  }

  const report = q.data;
  if (q.error || !report) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="mb-2 font-serif text-2xl font-black">Report not available</h1>
        <p className="text-sm text-muted-foreground">
          This link isn't valid or has been turned off. Please contact the publisher for a new one.
        </p>
      </div>
    );
  }

  const impressions = Number(report.total_impressions);
  const clicks = Number(report.total_clicks);
  const goal = report.campaign.impression_goal;
  const pct = goal ? Math.min(100, Math.round((impressions / goal) * 100)) : null;
  const rangeImpressions = trend.reduce((n, d) => n + d.impressions, 0);
  const rangeClicks = trend.reduce((n, d) => n + d.clicks, 0);

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Campaign report</p>
          <h1 className="font-serif text-3xl font-black">{report.campaign.name}</h1>
          <p className="text-sm text-muted-foreground">
            {report.campaign.advertiser}
            {report.campaign.starts_at || report.campaign.ends_at
              ? ` · ${formatNairobi(report.campaign.starts_at)} to ${formatNairobi(report.campaign.ends_at)}`
              : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 print:hidden">
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
          <button
            type="button"
            onClick={() => window.print()}
            className="h-10 border border-input bg-background px-3 text-sm"
          >
            Print / save PDF
          </button>
        </div>
      </div>

      <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">All time</p>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {[
          ["Impressions", impressions.toLocaleString()],
          ["Clicks", clicks.toLocaleString()],
          ["Click-through rate", ctr(clicks, impressions)],
        ].map(([label, value]) => (
          <div key={label} className="border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {goal && pct !== null && (
        <div className="mb-6 border border-border bg-background p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium">Delivery against goal</span>
            <span className="text-muted-foreground">
              {impressions.toLocaleString()} of {goal.toLocaleString()} impressions ({pct}%)
            </span>
          </div>
          <div className="h-2 bg-muted">
            <div className="h-full bg-[var(--brand)]" style={{ width: `${pct}%` }} />
          </div>
        </div>
      )}

      <div className="mb-6 border border-border bg-background p-4">
        <p className="mb-1 text-sm font-medium">Daily performance (Nairobi time)</p>
        <p className="mb-3 text-xs text-muted-foreground">
          Last {days} days: {rangeImpressions.toLocaleString()} impressions, {rangeClicks.toLocaleString()} clicks
        </p>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <LineChart data={trend} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
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
              <th className="p-3 text-left">Creative</th>
              <th className="p-3 text-left">Placement</th>
              <th className="p-3 text-right">Impressions</th>
              <th className="p-3 text-right">Clicks</th>
              <th className="p-3 text-right">CTR</th>
            </tr>
          </thead>
          <tbody>
            {report.ads.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-muted-foreground">
                  No ads in this campaign yet.
                </td>
              </tr>
            )}
            {report.ads.map((a, i) => (
              <tr key={`${a.name}-${i}`} className="border-b border-border last:border-b-0">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {a.image_url && (
                      <img src={a.image_url} alt="" className="h-10 w-20 border border-border object-contain" loading="lazy" />
                    )}
                    <span className="font-medium">{a.name}</span>
                  </div>
                </td>
                <td className="p-3 text-muted-foreground">{a.placement}</td>
                <td className="p-3 text-right">{Number(a.impressions).toLocaleString()}</td>
                <td className="p-3 text-right">{Number(a.clicks).toLocaleString()}</td>
                <td className="p-3 text-right text-muted-foreground">{ctr(Number(a.clicks), Number(a.impressions))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        An impression is counted when an ad is at least 50% visible for 1 second, once per visitor session. Clicks are
        counted through a tracked link. Automated traffic and repeat clicks within 5 minutes are excluded. Data starts
        from when tracking was switched on.
      </p>
    </div>
  );
}