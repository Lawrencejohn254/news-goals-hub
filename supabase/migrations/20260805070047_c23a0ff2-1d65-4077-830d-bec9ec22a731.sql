INSERT INTO public.competitions (name, slug, country, logo_url, season, external_id, is_tracked, sort_order)
VALUES ('Cupa României','cupa-romaniei-285','Romania','https://media.api-sports.io/football/leagues/285.png','2026',285,true,0)
ON CONFLICT DO NOTHING;