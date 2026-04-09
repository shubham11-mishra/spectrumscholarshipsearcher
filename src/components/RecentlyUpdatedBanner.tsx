import { Zap } from "lucide-react";

const RecentlyUpdatedBanner = ({ onFilterSchool }: { onFilterSchool: (school: string) => void }) => (
  <div className="max-w-[1100px] mx-auto mb-8 px-4 md:px-8 animate-fade-up" style={{ animationDelay: "0.15s" }}>
    <div className="relative overflow-hidden rounded-2xl p-5 flex items-center gap-5 flex-wrap"
      style={{ background: 'linear-gradient(135deg, hsl(265 85% 25%), hsl(265 60% 18%), hsl(225 25% 12%))' }}
    >
      {/* Decorative accent */}
      <div className="absolute top-0 right-0 w-[300px] h-[200px] bg-accent/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="relative z-10 w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
        <Zap className="w-5 h-5 text-gold" />
      </div>
      <div className="flex-1 relative z-10">
        <strong className="text-foreground text-[14px] block mb-0.5">Recently Updated</strong>
        <span className="text-muted-foreground text-[12px]">Verified or updated in the last 7 days</span>
      </div>
      <div className="flex gap-2 flex-wrap relative z-10">
        {[
          { school: "Scotch College", time: "2h ago" },
          { school: "MLC", time: "5h ago" },
          { school: "Geelong Grammar", time: "1d ago" },
        ].map((item) => (
          <button
            key={item.school}
            onClick={() => onFilterSchool(item.school)}
            className="glass rounded-xl px-3 py-1.5 text-xs font-medium cursor-pointer hover:bg-primary/20 hover:border-primary/30 transition-all text-foreground"
          >
            {item.school} · <span className="text-accent">{item.time}</span>
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default RecentlyUpdatedBanner;
