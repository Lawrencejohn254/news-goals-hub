import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type StaffRole = "super_admin" | "admin" | "editor" | "author" | "moderator" | "subscriber";

export function useStaffRoles() {
  const [roles, setRoles] = useState<StaffRole[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      setUserId(data.user?.id ?? null);
      if (data.user) {
        const { data: rows } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.user.id);
        if (active) setRoles((rows ?? []).map((r) => r.role as StaffRole));
      }
      if (active) setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const hasAny = (...check: StaffRole[]) => check.some((r) => roles.includes(r));

  return {
    roles,
    userId,
    loading,
    hasAny,
    isStaff: hasAny("super_admin", "admin", "editor", "author", "moderator"),
    isEditorOrAbove: hasAny("editor", "admin", "super_admin"),
    isAdminOrAbove: hasAny("admin", "super_admin"),
  };
}