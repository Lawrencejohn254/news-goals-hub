
-- Lock search_path on all functions (already set on most, add for tg_updated_at)
ALTER FUNCTION public.tg_updated_at() SET search_path = public;

-- Restrict SECURITY DEFINER helpers to service_role and authenticated where needed
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.tg_updated_at() FROM PUBLIC, anon, authenticated;

-- has_role and is_staff are used by RLS policies (which run as the invoking user via SECURITY DEFINER wrapper),
-- but the linter still flags direct callability. Restrict to authenticated only (needed inside policies).
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon;
