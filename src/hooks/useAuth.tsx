import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  interests: string[];
  signOut: () => Promise<void>;
  refreshInterests: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  interests: [],
  signOut: async () => {},
  refreshInterests: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);

  const fetchInterests = async (userId: string) => {
    const { data } = await supabase
      .from("user_interests")
      .select("category")
      .eq("user_id", userId);
    setInterests(data?.map((d) => d.category) || []);
  };

  const refreshInterests = async () => {
    if (user) await fetchInterests(user.id);
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchInterests(session.user.id), 0);
        } else {
          setInterests([]);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchInterests(session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setInterests([]);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, interests, signOut, refreshInterests }}>
      {children}
    </AuthContext.Provider>
  );
};
