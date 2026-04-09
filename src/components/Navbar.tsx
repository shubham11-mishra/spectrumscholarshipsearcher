import { Sparkles, LogOut, User, Heart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useShortlist } from "@/hooks/useShortlist";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { count } = useShortlist();
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 glass px-4 md:px-8 flex items-center justify-between h-14">
      <a href="/" className="flex items-center gap-2.5 font-display font-bold text-lg text-foreground no-underline tracking-tight">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground text-sm font-display font-bold shadow-md">
          S
        </div>
        <span className="gradient-text">Spectrum Scholarship Searcher</span>
      </a>
      <div className="flex items-center gap-1">
        <a href="/" className="hidden md:inline-block px-3 py-1.5 rounded-lg text-muted-foreground text-sm font-medium hover:bg-secondary hover:text-foreground transition-all">
          Browse
        </a>
        <button
          onClick={() => navigate("/shortlist")}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-muted-foreground text-sm font-medium hover:bg-secondary hover:text-foreground transition-all bg-transparent border-none cursor-pointer relative"
        >
          <Heart className="w-3.5 h-3.5" />
          Shortlist
          {count > 0 && (
            <span className="bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1">
              {count}
            </span>
          )}
        </button>

        {user ? (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-sm text-muted-foreground">
              <User className="w-3.5 h-3.5" />
              <span className="max-w-[120px] truncate">{user.email}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all bg-transparent border-none cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent text-primary-foreground px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 glow-primary border-none cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Login/SignUp
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
