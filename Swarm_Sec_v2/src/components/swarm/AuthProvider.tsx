import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { useRouter } from '@tanstack/react-router';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const Context = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: true });
export const useAccount = () => useContext(Context);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null); const [loading, setLoading] = useState(true);
  const router = useRouter(); const queryClient = useQueryClient();
  useEffect(() => {
    let alive = true;
    const refresh = async () => { const { data } = await supabase.auth.getUser(); if (alive) { setUser(data.user); setLoading(false); } };
    void refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      if (event === 'SIGNED_OUT') { setUser(null); void router.invalidate(); return; }
      // Avoid calling Auth methods inside its locked callback.
      setTimeout(() => { void refresh().then(() => { void router.invalidate(); void queryClient.invalidateQueries(); }); }, 0);
    });
    return () => { alive = false; subscription.unsubscribe(); };
  }, [router, queryClient]);
  return <Context.Provider value={{ user, loading }}>{children}</Context.Provider>;
}
