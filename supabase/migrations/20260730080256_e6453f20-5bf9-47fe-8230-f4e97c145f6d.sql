
-- TEAMS
CREATE TABLE public.teams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_name text,
  slug text NOT NULL UNIQUE,
  crest_url text,
  country text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.teams TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.teams TO authenticated;
GRANT ALL ON public.teams TO service_role;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Teams readable" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Staff manage teams" ON public.teams FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER teams_updated_at BEFORE UPDATE ON public.teams FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- COMPETITIONS
CREATE TABLE public.competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  country text,
  logo_url text,
  season text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.competitions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.competitions TO authenticated;
GRANT ALL ON public.competitions TO service_role;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Competitions readable" ON public.competitions FOR SELECT USING (true);
CREATE POLICY "Staff manage competitions" ON public.competitions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER competitions_updated_at BEFORE UPDATE ON public.competitions FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- MATCHES
CREATE TYPE public.match_status AS ENUM ('scheduled','live','finished','postponed','cancelled');
CREATE TABLE public.matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid REFERENCES public.competitions(id) ON DELETE SET NULL,
  home_team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  away_team_id uuid NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  kickoff_at timestamptz NOT NULL,
  venue text,
  status public.match_status NOT NULL DEFAULT 'scheduled',
  home_score integer,
  away_score integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX matches_kickoff_idx ON public.matches (kickoff_at DESC);
GRANT SELECT ON public.matches TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.matches TO authenticated;
GRANT ALL ON public.matches TO service_role;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Matches readable" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Staff manage matches" ON public.matches FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER matches_updated_at BEFORE UPDATE ON public.matches FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- PREDICTIONS
CREATE TYPE public.prediction_result AS ENUM ('pending','won','lost','void');
CREATE TABLE public.predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id uuid NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  tip text NOT NULL,
  confidence integer NOT NULL DEFAULT 3,
  odds numeric(6,2),
  predicted_home_score integer,
  predicted_away_score integer,
  analysis text NOT NULL DEFAULT '',
  home_form text,
  away_form text,
  head_to_head text,
  key_stats text,
  author_id uuid NOT NULL,
  is_published boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  result public.prediction_result NOT NULL DEFAULT 'pending',
  view_count integer NOT NULL DEFAULT 0,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.predictions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.predictions TO authenticated;
GRANT ALL ON public.predictions TO service_role;
ALTER TABLE public.predictions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published predictions readable" ON public.predictions FOR SELECT USING (is_published = true);
CREATE POLICY "Staff read all predictions" ON public.predictions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage predictions" ON public.predictions FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER predictions_updated_at BEFORE UPDATE ON public.predictions FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- MEDIA
CREATE TABLE public.media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  file_name text NOT NULL,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  alt_text text,
  uploaded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.media TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.media TO authenticated;
GRANT ALL ON public.media TO service_role;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Media readable" ON public.media FOR SELECT USING (true);
CREATE POLICY "Staff manage media" ON public.media FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER media_updated_at BEFORE UPDATE ON public.media FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- NEWSLETTER
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  status text NOT NULL DEFAULT 'subscribed',
  source text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage subscribers" ON public.newsletter_subscribers FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Staff delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER newsletter_updated_at BEFORE UPDATE ON public.newsletter_subscribers FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- ADS
CREATE TABLE public.ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  placement text NOT NULL,
  image_url text,
  html_code text,
  target_url text,
  is_active boolean NOT NULL DEFAULT true,
  starts_at timestamptz,
  ends_at timestamptz,
  impressions integer NOT NULL DEFAULT 0,
  clicks integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.ads TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ads TO authenticated;
GRANT ALL ON public.ads TO service_role;
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Active ads readable" ON public.ads FOR SELECT USING (is_active = true);
CREATE POLICY "Staff read all ads" ON public.ads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "Staff manage ads" ON public.ads FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER ads_updated_at BEFORE UPDATE ON public.ads FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- SITE SETTINGS
CREATE TABLE public.site_settings (
  id integer PRIMARY KEY DEFAULT 1,
  site_name text NOT NULL DEFAULT 'Dispatch',
  tagline text,
  description text,
  logo_url text,
  twitter_url text,
  facebook_url text,
  instagram_url text,
  youtube_url text,
  ga_measurement_id text,
  default_seo_title text,
  default_seo_description text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_singleton CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings readable" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins update settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin')) WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE POLICY "Admins insert settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin') OR public.has_role(auth.uid(),'super_admin'));
CREATE TRIGGER site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();
INSERT INTO public.site_settings (id, site_name, tagline, description) VALUES (1, 'Dispatch', 'News, sport and football predictions', 'Breaking news, in-depth reporting and expert football predictions.');

-- PAGE VIEWS
CREATE TABLE public.page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  path text NOT NULL,
  article_id uuid REFERENCES public.articles(id) ON DELETE CASCADE,
  prediction_id uuid REFERENCES public.predictions(id) ON DELETE CASCADE,
  referrer text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX page_views_created_idx ON public.page_views (created_at DESC);
GRANT INSERT ON public.page_views TO anon;
GRANT SELECT, INSERT ON public.page_views TO authenticated;
GRANT ALL ON public.page_views TO service_role;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a view" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff read views" ON public.page_views FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

-- Seed competitions & teams
INSERT INTO public.competitions (name, slug, country, season, sort_order) VALUES
  ('Premier League','premier-league','England','2025/26',1),
  ('La Liga','la-liga','Spain','2025/26',2),
  ('Serie A','serie-a','Italy','2025/26',3),
  ('Bundesliga','bundesliga','Germany','2025/26',4),
  ('UEFA Champions League','champions-league','Europe','2025/26',5);

INSERT INTO public.teams (name, short_name, slug, country) VALUES
  ('Arsenal','ARS','arsenal','England'),
  ('Manchester City','MCI','manchester-city','England'),
  ('Liverpool','LIV','liverpool','England'),
  ('Chelsea','CHE','chelsea','England'),
  ('Manchester United','MUN','manchester-united','England'),
  ('Tottenham Hotspur','TOT','tottenham-hotspur','England'),
  ('Real Madrid','RMA','real-madrid','Spain'),
  ('Barcelona','BAR','barcelona','Spain'),
  ('Inter Milan','INT','inter-milan','Italy'),
  ('Bayern Munich','BAY','bayern-munich','Germany');
