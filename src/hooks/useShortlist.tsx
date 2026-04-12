import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface ShortlistContextType {
  shortlisted: Set<string>;
  toggle: (id: string) => void;
  isShortlisted: (id: string) => boolean;
  count: number;
  loading: boolean;
}

const ShortlistContext = createContext<ShortlistContextType>({
  shortlisted: new Set(),
  toggle: () => {},
  isShortlisted: () => false,
  count: 0,
  loading: true,
});

export const useShortlist = () => useContext(ShortlistContext);

export const ShortlistProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  // Fetch shortlist from database when user changes
  useEffect(() => {
    if (!user) {
      setShortlisted(new Set());
      setLoading(false);
      return;
    }

    const fetchShortlist = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("shortlisted_schools")
        .select("school_id")
        .eq("user_id", user.id);
      setShortlisted(new Set(data?.map((d) => d.school_id) || []));
      setLoading(false);
    };

    fetchShortlist();
  }, [user]);

  const toggle = useCallback(
    async (id: string) => {
      if (!user) return;

      const isCurrentlyShortlisted = shortlisted.has(id);

      // Optimistic update
      setShortlisted((prev) => {
        const next = new Set(prev);
        if (isCurrentlyShortlisted) next.delete(id);
        else next.add(id);
        return next;
      });

      if (isCurrentlyShortlisted) {
        await supabase
          .from("shortlisted_schools")
          .delete()
          .eq("user_id", user.id)
          .eq("school_id", id);
      } else {
        await supabase
          .from("shortlisted_schools")
          .insert({ user_id: user.id, school_id: id });
      }
    },
    [user, shortlisted]
  );

  const isShortlisted = useCallback((id: string) => shortlisted.has(id), [shortlisted]);

  return (
    <ShortlistContext.Provider value={{ shortlisted, toggle, isShortlisted, count: shortlisted.size, loading }}>
      {children}
    </ShortlistContext.Provider>
  );
};
