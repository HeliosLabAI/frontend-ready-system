import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MoreHorizontal, ArrowRightToLine, ZoomIn, ZoomOut, ChevronDown } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PaperViewMode } from "@/types";

export const DocumentViewer = () => {
  const { selectedPaper, setSelectedPaper, setViewMode } = useAppState();
  const [viewMode, setLocalViewMode] = useState<PaperViewMode>("pdf");
  const [zoom, setZoom] = useState(132);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  if (!selectedPaper) return null;

  const paper = selectedPaper;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Breadcrumb */}
      <div className="px-6 pt-4 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={() => { setSelectedPaper(null); setViewMode("home"); }} className="hover:text-foreground transition-colors">Home</button>
          <span className="text-muted-foreground/50">›</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">{paper.theme}</span>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground">{paper.title.length > 35 ? paper.title.slice(0, 35) + "..." : paper.title}</span>
          <button className="ml-auto p-1 hover:bg-accent rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pt-2 pb-2 shrink-0">
        <h1 className="text-[22px] font-bold text-foreground leading-snug tracking-tight">
          {paper.title}
        </h1>
      </div>

      {/* Search + controls bar */}
      <div className="flex items-center justify-between px-6 pb-3 shrink-0">
        <div className={`flex items-center bg-secondary rounded-md px-3 py-1.5 transition-all border ${searchFocused ? "border-muted-foreground/30" : "border-transparent"}`}>
          <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Semantic search..."
            className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-32"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <span className="tabular-nums">{zoom}%</span>
            <ChevronDown className="w-3 h-3" />
          </div>
          <div className="flex bg-secondary rounded-md overflow-hidden border border-transparent">
            <button
              onClick={() => setLocalViewMode("pdf")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === "pdf" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >PDF</button>
            <button
              onClick={() => setLocalViewMode("plain")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${viewMode === "plain" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >Plain text</button>
          </div>
          <button className="p-1 hover:bg-accent rounded transition-colors">
            <ArrowRightToLine className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Paper content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-muted/30">
        <div className="px-6 py-5">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-[680px] mx-auto"
          >
            {viewMode === "pdf" ? (
              <div className="bg-background border border-border shadow-sm p-8 min-h-[800px]">
                {/* Paper header rule */}
                <div className="border-t border-foreground/20 mb-1" />
                <div className="border-t border-foreground/10 mb-6" />

                <h2 className="text-lg font-bold text-center text-foreground leading-snug mb-4">
                  {paper.title}
                </h2>

                <p className="text-[10px] text-center text-muted-foreground leading-relaxed mb-6">
                  {paper.authors.map((a, i) => (
                    <span key={i}>{a} <sup className="text-[8px]">{i === 0 ? "*1" : "1"}</sup>{i < paper.authors.length - 1 ? "   " : ""}</span>
                  ))}
                </p>

                <div className={`gap-5 text-[11px] leading-[1.6] text-foreground/85 ${paper.body.length > 1 ? "grid grid-cols-2" : ""}`}>
                  <div>
                    <h3 className="font-bold text-xs mb-1.5 text-foreground text-center">Abstract</h3>
                    <p className="text-justify hyphens-auto indent-4">{paper.abstract}</p>
                  </div>
                  <div className="space-y-2">
                    {paper.body.map((para, i) => (
                      <p key={i} className="text-justify hyphens-auto indent-4">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-background border border-border shadow-sm p-8 space-y-4">
                <h2 className="text-lg font-bold text-foreground">{paper.title}</h2>
                <p className="text-xs text-muted-foreground">{paper.authors.join(", ")}</p>
                <div className="flex gap-2">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-accent rounded-full text-muted-foreground">{tag}</span>
                  ))}
                </div>
                <div className="border-t border-border pt-4">
                  <h3 className="text-sm font-semibold text-foreground mb-2">Abstract</h3>
                  <p className="text-sm text-foreground/80 leading-relaxed">{paper.abstract}</p>
                </div>
                {paper.body.map((para, i) => (
                  <p key={i} className="text-sm text-foreground/80 leading-relaxed">{para}</p>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
