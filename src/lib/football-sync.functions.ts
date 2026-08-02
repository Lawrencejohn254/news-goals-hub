import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { ProviderLeague } from "@/lib/football-sync.server";

async function assertStaff(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc("is_staff", { _user_id: context.userId });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden");
}

export const searchLeaguesFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { query: string; country?: string }) => input)
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { searchLeagues } = await import("@/lib/football-sync.server");
    return await searchLeagues(data.query ?? "", data.country);
  });

export const trackLeagueFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: ProviderLeague) => input)
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { trackLeague } = await import("@/lib/football-sync.server");
    return { id: await trackLeague(data) };
  });

export const setLeagueTrackedFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { competitionId: string; tracked: boolean }) => input)
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { setLeagueTracked } = await import("@/lib/football-sync.server");
    await setLeagueTracked(data.competitionId, data.tracked);
    return { ok: true };
  });

export const syncFixturesFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { days?: number }) => input)
  .handler(async ({ data, context }) => {
    await assertStaff(context as any);
    const { syncFixtures } = await import("@/lib/football-sync.server");
    return await syncFixtures(data.days ?? 10);
  });

export const settleResultsFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as any);
    const { settleResults } = await import("@/lib/football-sync.server");
    return await settleResults();
  });
