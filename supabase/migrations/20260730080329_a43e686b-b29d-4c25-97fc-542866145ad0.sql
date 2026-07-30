
DROP POLICY "Anyone can subscribe" ON public.newsletter_subscribers;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    email ~* '^[A-Za-z0-9._%%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    AND length(email) <= 254
    AND status = 'subscribed'
    AND (source IS NULL OR length(source) <= 40)
  );

DROP POLICY "Anyone can log a view" ON public.page_views;
CREATE POLICY "Anyone can log a view" ON public.page_views
  FOR INSERT TO anon, authenticated
  WITH CHECK (
    path ~ '^/[A-Za-z0-9/_.$-]*$'
    AND length(path) <= 300
    AND (referrer IS NULL OR length(referrer) <= 300)
  );
