import { Search, Sparkles } from "lucide-react";

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearch: () => void;
}

const HeroSection = ({ searchQuery, onSearchChange, onSearch }: HeroSectionProps) => (
  <section className="relative py-16 md:py-24 px-4 md:px-8 max-w-[860px] mx-auto text-center animate-fade-up overflow-hidden">
    {/* Ambient glow orbs */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />
    <div className="absolute top-20 right-0 w-[200px] h-[200px] bg-gold/10 rounded-full blur-[80px] pointer-events-none animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

    <div className="relative z-10">
      <div className="inline-flex items-center gap-2 glass px-4 py-1.5 rounded-full text-[12px] font-semibold mb-7 tracking-wide uppercase text-accent">
        <Sparkles className="w-3.5 h-3.5 text-gold animate-float" />
        2,400+ Scholarships · Updated Weekly
      </div>
      <h1 className="font-display font-bold text-foreground text-3xl md:text-[56px] leading-[1.1] mb-5 tracking-tight">
        Find the perfect scholarship
        <br />
        <span className="gradient-text">for your child</span>
      </h1>
      <p className="text-[15px] text-muted-foreground max-w-[520px] mx-auto mb-10 leading-relaxed">
        Search every Australian private school scholarship in one place — AI-verified data, direct links, closing date alerts.
      </p>
      <div className="glass rounded-2xl px-4 py-1.5 flex items-center gap-2 max-w-[600px] mx-auto mb-5 focus-within:border-primary/50 focus-within:glow-primary transition-all">
        <Search className="w-[18px] h-[18px] text-muted-foreground shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search by school, suburb or scholarship…"
          className="flex-1 border-none outline-none text-[14px] bg-transparent text-foreground py-2.5 placeholder:text-muted-foreground"
        />
        <button
          onClick={onSearch}
          className="bg-gradient-to-r from-primary to-accent text-primary-foreground border-none rounded-xl px-5 py-2 text-sm font-semibold cursor-pointer whitespace-nowrap hover:opacity-90 transition-all"
        >
          Search
        </button>
      </div>
      
    </div>
  </section>
);

export default HeroSection;
