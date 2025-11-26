import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const SUPER_ADMIN_EMAIL = (import.meta.env.VITE_SUPER_ADMIN_EMAIL as string) || 'admin@la121consultants.co.uk';

export const useSuperAdmin = () => {
  const { user, loading: authLoading } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const normalizedEmail = useMemo(
    () => SUPER_ADMIN_EMAIL.trim().toLowerCase(),
    []
  );

  useEffect(() => {
    const checkSuperAdmin = async () => {
      if (!user) {
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      if (user.email?.toLowerCase() !== normalizedEmail) {
        setIsSuperAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error checking super admin role:', error);
        }

        setIsSuperAdmin(true);
      } catch (error) {
        console.error('Error checking super admin role:', error);
        setIsSuperAdmin(true);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      checkSuperAdmin();
    }
  }, [authLoading, normalizedEmail, user]);

  return { isSuperAdmin, loading: loading || authLoading, superAdminEmail: normalizedEmail };
};

export { SUPER_ADMIN_EMAIL };
