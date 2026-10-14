import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

// Same client as everywhere else, but without the generated table types.
// Lets pages use tables and functions added after types.ts was generated
// (advertisers, campaigns, ad_stats, campaign_report) without type errors.
export const db = supabase as unknown as SupabaseClient;