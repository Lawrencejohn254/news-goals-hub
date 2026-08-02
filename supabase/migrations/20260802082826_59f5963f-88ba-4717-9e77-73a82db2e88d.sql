ALTER TABLE public.competitions
  ADD COLUMN IF NOT EXISTS external_id integer,
  ADD COLUMN IF NOT EXISTS is_tracked boolean NOT NULL DEFAULT false;
CREATE UNIQUE INDEX IF NOT EXISTS competitions_external_id_key ON public.competitions(external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS external_id integer;
CREATE UNIQUE INDEX IF NOT EXISTS teams_external_id_key ON public.teams(external_id) WHERE external_id IS NOT NULL;

ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS external_id integer;
CREATE UNIQUE INDEX IF NOT EXISTS matches_external_id_key ON public.matches(external_id) WHERE external_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS matches_kickoff_idx ON public.matches(kickoff_at);

ALTER TABLE public.predictions ADD COLUMN IF NOT EXISTS settled_at timestamptz;