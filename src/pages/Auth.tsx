import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, Sparkles, CheckCircle2, MapPin, GraduationCap, Heart } from "lucide-react";

const CATEGORIES = ["Academic", "Music", "Sport", "General"];
const AU_STATES = ["NSW", "VIC", "QLD", "WA", "SA", "TAS", "ACT", "NT"];
const YEAR_LEVELS = ["Year 5", "Year 6", "Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"];

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [stateCode, setStateCode] = useState("");
  const [postcode, setPostcode] = useState("");
  const [suburb, setSuburb] = useState("");
  const [yearLevel, setYearLevel] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Don't redirect if user arrived via password recovery link
    const hash = window.location.hash;
    if (user && !hash.includes("type=recovery")) navigate("/");
  }, [user, navigate]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      } else {
        if (!fullName.trim() || !email.trim() || password.length < 6) {
          setError("Please fill in your name, email, and a password (6+ chars).");
          setSubmitting(false);
          return;
        }
        if (!yearLevel) {
          setError("Please select your current year level.");
          setSubmitting(false);
          return;
        }
        if (!stateCode || !/^\d{4}$/.test(postcode.trim())) {
          setError("Please select your state and enter a valid 4-digit postcode.");
          setSubmitting(false);
          return;
        }
        if (selectedCategories.length === 0) {
          setError("Please select at least one interest category.");
          setSubmitting(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              state: stateCode,
              postcode: postcode.trim(),
              suburb: suburb.trim(),
              year_level: yearLevel,
            },
          },
        });
        // Ignore email rate limit errors since auto-confirm is enabled
        if (error && !error.message.toLowerCase().includes("rate limit")) throw error;

        if (data?.session?.user) {
          const userId = data.session.user.id;

          // Save interests (profile fields are written by the signup DB trigger)
          const inserts = selectedCategories.map((category) => ({
            user_id: userId,
            category,
          }));
          const { error: interestsError } = await supabase.from("user_interests").insert(inserts);
          if (interestsError) throw interestsError;
        }
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-lg font-display font-bold shadow-md">
            S
          </div>
          <span className="gradient-text font-display font-bold text-xl">Spectrum</span>
        </a>

        <div className="glass rounded-2xl p-6 md:p-8">
          <h1 className="font-display text-2xl font-bold text-foreground text-center mb-1">
            {isLogin ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isLogin
              ? "Sign in to see your personalized scholarships"
              : "Tell us a bit about you to personalize your matches"}
          </p>

          {error && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm rounded-xl px-4 py-2.5 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* LOGIN: name field hidden */}
            {!isLogin && (
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required={!isLogin}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>
            )}

            {/* Email + Password — always shown */}
            <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="••••••••"
                      className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

            {/* SIGNUP — Year level + Location + Interests on a single page */}
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" /> Current year level
                  </label>
                  <select
                    value={yearLevel}
                    onChange={(e) => setYearLevel(e.target.value)}
                    required
                    className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                  >
                    <option value="">Select year level</option>
                    {YEAR_LEVELS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> Where are you located?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      required
                      className="w-full rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all cursor-pointer"
                    >
                      <option value="">State</option>
                      {AU_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <input
                      type="text"
                      value={postcode}
                      onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      required
                      inputMode="numeric"
                      pattern="\d{4}"
                      placeholder="Postcode"
                      className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                    />
                  </div>
                  <input
                    type="text"
                    value={suburb}
                    onChange={(e) => setSuburb(e.target.value)}
                    placeholder="Suburb (optional)"
                    className="w-full rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all"
                  />
                </div>

                <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5" /> Pick your interests & strengths
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CATEGORIES.map((cat) => {
                    const selected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`relative rounded-xl border px-4 py-3 text-sm font-medium cursor-pointer transition-all flex items-center gap-2 ${
                          selected
                            ? "border-primary/50 bg-primary/10 text-primary glow-primary"
                            : "border-border bg-secondary text-muted-foreground hover:border-primary/30 hover:text-foreground"
                        }`}
                      >
                        {selected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2">Select all that apply.</p>
                </div>
              </>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl px-4 py-2.5 text-sm font-semibold cursor-pointer hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 border-none"
            >
              <Sparkles className="w-4 h-4" />
              {submitting ? (isLogin ? "Please wait..." : "Creating...") : isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* (removed legacy multi-step action buttons) */}
          {false && (
            <div className="hidden">
              {/* placeholder to keep diff small */}
              </div>
            )}

          {isLogin && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={async () => {
                  if (!email) {
                    setError("Please enter your email first, then click Forgot Password.");
                    return;
                  }
                  setError("");
                  setSubmitting(true);
                  try {
                    const { error } = await supabase.auth.resetPasswordForEmail(email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    if (error) throw error;
                    setError("Password reset link sent! Check your email.");
                  } catch (err: any) {
                    setError(err.message || "Something went wrong");
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div className="mt-3 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-sm text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
            >
              {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
