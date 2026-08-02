ALTER TABLE public.articles DROP CONSTRAINT IF EXISTS articles_author_profile_fkey;
ALTER TABLE public.articles
  ADD CONSTRAINT articles_author_profile_fkey
  FOREIGN KEY (author_id) REFERENCES public.profiles(id) ON DELETE SET NULL;