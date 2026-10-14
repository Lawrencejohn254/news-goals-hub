-- ELECTION COUNTDOWN
-- Single settings row (id = 1) that drives the countdown banner under the
-- site masthead. Public can read it; only admin / super_admin can change it,
-- same access model as site_settings.
CREATE TABLE public.election_countdown (
  id integer PRIMARY KEY DEFAULT 1,
  is_enabled boolean NOT NULL DEFAULT false,
  show_on_all_pages boolean NOT NULL DEFAULT false,

  title text NOT NULL DEFAULT 'Kenya General Election',
  subtitle text NOT NULL DEFAULT 'Counting down to polling day',
  -- Stored in UTC. Default = 10 Aug 2027, 06:00 EAT (second Tuesday of August).
  target_at timestamptz NOT NULL DEFAULT '2027-08-10T03:00:00Z',
  ended_message text NOT NULL DEFAULT 'Kenyans are voting today',

  flag_mode text NOT NULL DEFAULT 'kenya',
  flag_position text NOT NULL DEFAULT 'sides',
  flag_image_url text,
  flag_color_1 text NOT NULL DEFAULT '#000000',
  flag_color_2 text NOT NULL DEFAULT '#bb0000',
  flag_color_3 text NOT NULL DEFAULT '#006600',

  animation text NOT NULL DEFAULT 'flip',
  bg_from text NOT NULL DEFAULT '#0a0a0a',
  bg_to text NOT NULL DEFAULT '#10241a',
  accent text NOT NULL DEFAULT '#dc2626',
  tile_bg text NOT NULL DEFAULT '#161616',
  tile_text text NOT NULL DEFAULT '#ffffff',
  text_color text NOT NULL DEFAULT '#f5f5f4',

  updated_at timestamptz NOT NULL DEFAULT now(),

  CONSTRAINT election_countdown_singleton CHECK (id = 1),
  CONSTRAINT election_countdown_flag_mode CHECK (flag_mode IN ('kenya', 'stripes', 'image', 'none')),
  CONSTRAINT election_countdown_flag_position CHECK (flag_position IN ('sides', 'left', 'above')),
  CONSTRAINT election_countdown_animation CHECK (animation IN ('flip', 'slide', 'none')),
  CONSTRAINT election_countdown_title_len CHECK (char_length(title) BETWEEN 1 AND 80),
  CONSTRAINT election_countdown_subtitle_len CHECK (char_length(subtitle) <= 140),
  CONSTRAINT election_countdown_ended_len CHECK (char_length(ended_message) <= 140),
  CONSTRAINT election_countdown_flag_url CHECK (
    flag_image_url IS NULL
    OR (char_length(flag_image_url) <= 500 AND (flag_image_url ~ '^https://' OR flag_image_url ~ '^/media/'))
  ),
  CONSTRAINT election_countdown_hex CHECK (
    flag_color_1 ~ '^#[0-9a-fA-F]{6}$' AND flag_color_2 ~ '^#[0-9a-fA-F]{6}$' AND
    flag_color_3 ~ '^#[0-9a-fA-F]{6}$' AND bg_from ~ '^#[0-9a-fA-F]{6}$' AND
    bg_to ~ '^#[0-9a-fA-F]{6}$' AND accent ~ '^#[0-9a-fA-F]{6}$' AND
    tile_bg ~ '^#[0-9a-fA-F]{6}$' AND tile_text ~ '^#[0-9a-fA-F]{6}$' AND
    text_color ~ '^#[0-9a-fA-F]{6}$'
  )
);

GRANT SELECT ON public.election_countdown TO anon;
GRANT SELECT, INSERT, UPDATE ON public.election_countdown TO authenticated;
GRANT ALL ON public.election_countdown TO service_role;
ALTER TABLE public.election_countdown ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Countdown readable" ON public.election_countdown
  FOR SELECT USING (true);
CREATE POLICY "Admins update countdown" ON public.election_countdown
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));
CREATE POLICY "Admins insert countdown" ON public.election_countdown
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'super_admin'));

CREATE TRIGGER election_countdown_updated_at
  BEFORE UPDATE ON public.election_countdown
  FOR EACH ROW EXECUTE FUNCTION public.tg_updated_at();

-- Seed the single row (disabled until an admin switches it on).
INSERT INTO public.election_countdown (id) VALUES (1) ON CONFLICT (id) DO NOTHING;
