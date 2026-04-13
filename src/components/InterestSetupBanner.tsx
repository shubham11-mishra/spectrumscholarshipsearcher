import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const INTEREST_OPTIONS = ["Academic", "Music", "Sport", "General"];

const InterestSetupBanner = () => {
  const { user, refreshInterests } = useAuth();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const canSave = useMemo(() => selected.length > 0 && !saving, [selected.length, saving]);

  if (!user) return null;

  const toggleCategory = (category: string) => {
    setMessage("");
    setSelected((prev) =>
      prev.includes(category) ? prev.filter((item) => item !== category) : [...prev, category]
    );
  };

  const handleSave = async () => {
    if (!user || selected.length === 0) return;

    setSaving(true);
    setMessage("");

    const { error } = await supabase.from("user_interests").insert(
      selected.map((category) => ({ user_id: user.id, category }))
    );

    if (error) {
      setMessage("Could not save your interests. Please try again.");
      setSaving(false);
      return;
    }

    await refreshInterests();
    setMessage("Your interests are saved. Personalized results are now on.");
    setSaving(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-4 md:px-8 pb-3 animate-fade-up">
      <div className="glass rounded-2xl px-4 py-4 md:px-5 md:py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1">
              <Sparkles className="w-4 h-4 text-primary shrink-0" />
              Set your interests
            </div>
            <p className="text-sm text-muted-foreground">
              Pick a few categories to show personalized scholarship matches.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={!canSave}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-none rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save interests"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {INTEREST_OPTIONS.map((category) => {
            const isSelected = selected.includes(category);

            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-xl border px-4 py-3 text-sm font-medium cursor-pointer transition-all ${
                  isSelected
                    ? "border-primary/50 bg-primary/10 text-primary glow-primary"
                    : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {message && <p className="text-xs text-muted-foreground mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default InterestSetupBanner;