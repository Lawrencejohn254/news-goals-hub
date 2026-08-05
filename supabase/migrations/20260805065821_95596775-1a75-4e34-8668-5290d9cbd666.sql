DELETE FROM public.predictions p USING public.matches m WHERE p.match_id = m.id AND m.external_id IS NOT NULL;
DELETE FROM public.matches WHERE external_id IS NOT NULL;
DELETE FROM public.teams WHERE external_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.matches m WHERE m.home_team_id = teams.id OR m.away_team_id = teams.id);
UPDATE public.competitions SET external_id = NULL, is_tracked = false, season = NULL WHERE external_id IS NOT NULL;