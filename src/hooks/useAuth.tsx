import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface UserLocation {
  state: string | null;
  postcode: string | null;
  suburb: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  interests: string[];
  location: UserLocation;
  yearLevel: string | null;
  signOut: () => Promise<void>;
  refreshInterests: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  interests: [],
  location: { state: null, postcode: null, suburb: null },
  yearLevel: null,
  signOut: async () => {},
  refreshInterests: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [interests, setInterests] = useState<string[]>([]);
  const [location, setLocation] = useState<UserLocation>({ state: null, postcode: null, suburb: null });
  const [yearLevel, setYearLevel] = useState<string | null>(null);

  const fetchLocation = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("state, postcode, suburb, year_level")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Error loading user profile location:", error);
      return;
    }
    setLocation({
      state: data?.state ?? null,
      postcode: data?.postcode ?? null,
      suburb: data?.suburb ?? null,
    });
    setYearLevel(data?.year_level ?? null);
  };

  const fetchInterests = async (userId: string) => {
    const { data, error } = await supabase
      .from("user_interests")
      .select("category")
      .eq("user_id", userId);

    if (error) {
      console.error("Error loading user interests:", error);
      setInterests([]);
      return [];
    }

    const categories = data?.map((d) => d.category) || [];
    setInterests(categories);
    return categories;
  };

  const syncInterestsFromMetadata = async (sessionUser: User) => {
    const existingInterests = await fetchInterests(sessionUser.id);
    if (existingInterests.length > 0) return;

    const metadataInterests = Array.isArray(sessionUser.user_metadata?.interests)
      ? [...new Set(sessionUser.user_metadata.interests.filter((value): value is string => typeof value === "string" && value.trim().length > 0))]
      : [];

    if (metadataInterests.length === 0) return;

    const { error } = await supabase.from("user_interests").insert(
      metadataInterests.map((category) => ({ user_id: sessionUser.id, category }))
    );

    if (error) {
      console.error("Error syncing user interests:", error);
      return;
    }

    setInterests(metadataInterests);
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
          setTimeout(() => syncInterestsFromMetadata(session.user), 0);
          setTimeout(() => fetchLocation(session.user.id), 0);
        } else {
          setInterests([]);
          setLocation({ state: null, postcode: null, suburb: null });
          setYearLevel(null);
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        syncInterestsFromMetadata(session.user);
        fetchLocation(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setInterests([]);
    setLocation({ state: null, postcode: null, suburb: null });
    setYearLevel(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, interests, location, yearLevel, signOut, refreshInterests }}>
      {children}
    </AuthContext.Provider>
  );
};
