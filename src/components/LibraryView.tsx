import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search, Grid3X3, List, SortAsc, Calendar, Hash } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { papers } from "@/data/papers";
import { Paper } from "@/types";

export const LibraryView = () => {
  const { setSelectedPaper } = useAppState();
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"date" | "citations" | "title">("date");

  let filtered = papers.filter((p) =>
    !query || p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.authors.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
    p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "citations") return b.citationCount - a.citationCount;
    return a.title.localeCompare(b.title);
  });

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-background rounded-xl border border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <h1 className="text-2xl font-bold text-foreground tracking-tight mb-1">Library</h1>
          <p className="text-sm text-muted-foreground mb-6">{papers.length} papers across {4} themes</p>
        </motion.div>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-secondary rounded-md px-3 py-2 border border-transparent focus-within:border-muted-foreground/30 transition-colors">
            <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter papers..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          <div className="flex items-center bg-secondary rounded-md overflow-hidden border border-transparent">
            {[
              { key: "date" as const, icon: Calendar, label: "Date" },
              { key: "citations" as const, icon: Hash, label: "Citations" },
              { key: "title" as const, icon: SortAsc, label: "Title" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setSortBy(key)}
                className={`px-2.5 py-1.5 text-xs flex items-center gap-1 transition-colors
                  ${sortBy === key ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Icon className="w-3 h-3" /> {label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-secondary rounded-md overflow-hidden border border-transparent">
            <button onClick={() => setLayout("list")} className={`p-1.5 transition-colors ${layout === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <List className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setLayout("grid")} className={`p-1.5 transition-colors ${layout === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}>
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Results */}
        {layout === "list" ? (
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_160px_100px_80px] gap-2 px-4 py-2 bg-secondary/50 text-[11px] text-muted-foreground uppercase tracking-wider font-medium border-b border-border">
              <span>Title</span><span>Author</span><span>Date</span><span className="text-right">Citations</span>
            </div>
            {filtered.map((paper, i) => (
              <ListRow key={paper.id} paper={paper} index={i} onClick={() => setSelectedPaper(paper)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((paper, i) => (
              <GridCard key={paper.id} paper={paper} index={i} onClick={() => setSelectedPaper(paper)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ListRow = ({ paper, index, onClick }: { paper: Paper; index: number; onClick: () => void }) => (
  <motion.button
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.15, delay: index * 0.02 }}
    onClick={onClick}
    className="w-full grid grid-cols-[1fr_160px_100px_80px] gap-2 px-4 py-3 hover:bg-accent/30 transition-colors text-left border-b border-border last:border-0 items-center"
  >
    <div className="flex items-center gap-2 min-w-0">
      <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <span className="text-sm text-foreground truncate">{paper.title}</span>
    </div>
    <span className="text-xs text-muted-foreground truncate">{paper.authors[0]}</span>
    <span className="text-xs text-muted-foreground tabular-nums">{paper.date}</span>
    <span className="text-xs text-muted-foreground tabular-nums text-right">{paper.citationCount.toLocaleString()}</span>
  </motion.button>
);

const GridCard = ({ paper, index, onClick }: { paper: Paper; index: number; onClick: () => void }) => (
  <motion.button
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.15, delay: index * 0.03 }}
    onClick={onClick}
    className="text-left bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 hover:shadow-sm transition-all group"
  >
    <div className="flex items-start gap-2 mb-2">
      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
      <h3 className="text-sm font-medium text-foreground line-clamp-2 leading-snug">{paper.title}</h3>
    </div>
    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{paper.abstract}</p>
    <div className="flex items-center justify-between">
      <span className="text-[11px] text-muted-foreground">{paper.authors[0]} · {paper.date.slice(0, 4)}</span>
      <div className="flex gap-1">
        {paper.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-accent rounded text-muted-foreground">{tag}</span>
        ))}
      </div>
    </div>
  </motion.button>
);
