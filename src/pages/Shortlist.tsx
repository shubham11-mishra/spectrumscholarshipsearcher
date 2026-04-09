import { useState, useMemo, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SchoolCard from "@/components/SchoolCard";
import { SchoolScholarship, loadScholarshipsFromCSV } from "@/data/csvScholarships";
import { useShortlist } from "@/hooks/useShortlist";
import { Heart } from "lucide-react";

const Shortlist = () => {
  const { shortlisted } = useShortlist();
  const [schools, setSchools] = useState<SchoolScholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScholarshipsFromCSV().then((data) => {
      setSchools(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(
    () => schools.filter((s) => shortlisted.has(`${s.acara_id}-${s.row}`)),
    [schools, shortlisted]
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Heart className="w-5 h-5 text-primary fill-primary" />
          <h1 className="font-display text-2xl font-bold text-foreground">My Shortlist</h1>
          <span className="ml-2 text-sm text-muted-foreground">({filtered.length})</span>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4 animate-spin">⏳</div>
            <h3 className="font-display text-xl mb-2">Loading...</h3>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">💛</div>
            <h3 className="font-display text-xl mb-2">No shortlisted scholarships yet</h3>
            <p className="text-muted-foreground text-sm">Click the heart icon on any scholarship card to add it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s, i) => (
              <SchoolCard key={`${s.acara_id}-${s.row}`} school={s} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shortlist;
