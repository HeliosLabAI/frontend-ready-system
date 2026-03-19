import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Search, MoreHorizontal, ArrowRightToLine, ZoomIn, ZoomOut, PanelRightClose, PanelRight } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PaperViewMode } from "@/types";

export const DocumentViewer = () => {
  const { selectedPaper, setSelectedPaper, setViewMode, chatPanelOpen, setChatPanelOpen } = useAppState();
  const [viewMode, setLocalViewMode] = useState<PaperViewMode>("pdf");
  const [zoom, setZoom] = useState(100);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  if (!selectedPaper) return null;

  const paper = selectedPaper;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-4 h-12 border-b border-border bg-background shrink-0">
        <button onClick={() => { setSelectedPaper(null); setViewMode("home"); }} className="p-1.5 hover:bg-accent rounded-md transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent rounded-md transition-colors">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
        <div className="flex-1" />
        <button onClick={() => setChatPanelOpen(!chatPanelOpen)} className="p-1.5 hover:bg-accent rounded-md transition-colors">
          {chatPanelOpen ? <PanelRightClose className="w-4 h-4 text-muted-foreground" /> : <PanelRight className="w-4 h-4 text-muted-foreground" />}
        </button>
      </div>

      {/* Breadcrumb & title area */}
      <div className="px-8 pt-5 pb-3 bg-background shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <button onClick={() => { setSelectedPaper(null); setViewMode("home"); }} className="hover:text-foreground transition-colors">Home</button>
          <span>›</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">{paper.theme}</span>
          <span>›</span>
          <span className="text-foreground truncate max-w-[200px]">{paper.title.slice(0, 30)}...</span>
          <button className="ml-auto p-1 hover:bg-accent rounded transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
        </div>

        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight mb-4">
          {paper.title}
        </h1>

        {/* Search + controls */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center bg-secondary rounded-md px-3 py-1.5 transition-all border ${searchFocused ? "border-muted-foreground/30" : "border-transparent"}`}>
            <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Semantic search..."
              className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-40"
            />
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:bg-accent rounded transition-colors">
              <ZoomOut className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <span className="text-xs text-muted-foreground tabular-nums w-10 text-center">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(200, zoom + 10))} className="p-1 hover:bg-accent rounded transition-colors">
              <ZoomIn className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <div className="flex bg-secondary rounded-md overflow-hidden ml-2">
              <button
                onClick={() => setLocalViewMode("pdf")}
                className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === "pdf" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >PDF</button>
              <button
                onClick={() => setLocalViewMode("plain")}
                className={`px-3 py-1 text-xs font-medium transition-colors ${viewMode === "plain" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
              >Plain text</button>
            </div>
            <button className="p-1 hover:bg-accent rounded transition-colors">
              <ArrowRightToLine className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="max-w-3xl mx-auto"
          style={{ fontSize: `${zoom}%` }}
        >
          {viewMode === "pdf" ? (
            <div className="bg-surface-paper border border-border rounded-sm shadow-sm p-10">
              <div className="border-t-2 border-foreground/15 pt-6 mb-6">
                <h2 className="text-xl font-bold text-center text-foreground leading-tight mb-4">
                  {paper.title}
                </h2>
                <p className="text-xs text-center text-muted-foreground leading-relaxed mb-6">
                  {paper.authors.map((a, i) => (
                    <span key={i}>{a} <sup>1</sup>{i < paper.authors.length - 1 ? "   " : ""}</span>
                  ))}
                </p>
              </div>

              <div className={`gap-6 text-xs leading-relaxed text-foreground/80 ${paper.body.length > 1 ? "grid grid-cols-2" : ""}`}>
                <div>
                  <h3 className="font-bold text-sm mb-2 text-foreground">Abstract</h3>
                  <p className="text-justify hyphens-auto">{paper.abstract}</p>
                </div>
                <div className="space-y-3">
                  {paper.body.map((para, i) => (
                    <p key={i} className="text-justify hyphens-auto">{para}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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
  );
};
