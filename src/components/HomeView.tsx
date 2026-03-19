import { motion } from "framer-motion";
import { FileText, Clock, TrendingUp, ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { papers } from "@/data/papers";

export const HomeView = () => {
  const { setSelectedPaper, setViewMode } = useAppState();

  const recentPapers = papers.slice(0, 3);
  const trendingPapers = [...papers].sort((a, b) => b.citationCount - a.citationCount).slice(0, 3);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-background rounded-xl border border-border shadow-sm">
      <div className="max-w-3xl mx-auto px-8 py-10">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl font-bold text-foreground tracking-tight mb-2">Welcome back</h1>
          <p className="text-muted-foreground text-sm mb-8">Your research workspace — organized by themes, powered by AI.</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-10"
        >
          {[
            { icon: FileText, label: "Papers", value: papers.length.toString(), color: "text-ai-accent" },
            { icon: BookOpen, label: "Themes", value: "4", color: "text-success" },
            { icon: Sparkles, label: "AI Chats", value: "12", color: "text-citation-badge" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
              <span className="text-2xl font-semibold text-foreground tabular-nums">{value}</span>
            </div>
          ))}
        </motion.div>

        {/* Recently Viewed */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" /> Recently Viewed
            </h2>
            <button onClick={() => setViewMode("library")} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-1">
            {recentPapers.map((paper, i) => (
              <PaperRow key={paper.id} paper={paper} index={i} onClick={() => setSelectedPaper(paper)} />
            ))}
          </div>
        </motion.div>

        {/* Trending */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" /> Most Cited
            </h2>
          </div>
          <div className="space-y-1">
            {trendingPapers.map((paper, i) => (
              <PaperRow key={paper.id} paper={paper} index={i} onClick={() => setSelectedPaper(paper)} showCitations />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PaperRow = ({ paper, index, onClick, showCitations }: {
  paper: typeof papers[0]; index: number; onClick: () => void; showCitations?: boolean;
}) => (
  <motion.button
    initial={{ opacity: 0, x: -8 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: index * 0.03 }}
    onClick={onClick}
    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent/50 transition-colors text-left group"
  >
    <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
    <div className="flex-1 min-w-0">
      <p className="text-sm text-foreground truncate group-hover:text-foreground">{paper.title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{paper.authors[0]} · {paper.date.slice(0, 4)}</p>
    </div>
    {showCitations && (
      <span className="text-xs text-muted-foreground tabular-nums">{paper.citationCount.toLocaleString()} citations</span>
    )}
    <div className="flex gap-1">
      {paper.tags.slice(0, 2).map((tag) => (
        <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-accent rounded text-muted-foreground">{tag}</span>
      ))}
    </div>
  </motion.button>
);
