-- Photo credit shown under the article's main image (e.g. "Photo: KNA").
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS image_credit TEXT;
