import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, MoreHorizontal, ArrowRightToLine, ChevronDown, Send } from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { PaperViewMode } from "@/types";

export const DocumentViewer = () => {
  const { selectedPaper, setSelectedPaper, setViewMode, setSelectedTextForChat, chatPanelOpen } = useAppState();
  const [paperViewMode, setPaperViewMode] = useState<PaperViewMode>("pdf");
  const [zoom, setZoom] = useState(132);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showSendToChat, setShowSendToChat] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [floatingPos, setFloatingPos] = useState({ x: 0, y: 0 });

  // Detect text selection in the paper
  useEffect(() => {
    const handleMouseUp = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();
      if (text && text.length > 3) {
        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();
        if (rect) {
          setSelectedText(text);
          setFloatingPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
          setShowSendToChat(true);
        }
      } else {
        setShowSendToChat(false);
        setSelectedText("");
      }
    };

    document.addEventListener("mouseup", handleMouseUp);
    return () => document.removeEventListener("mouseup", handleMouseUp);
  }, []);

  const handleSendToChat = () => {
    if (selectedText) {
      setSelectedTextForChat(`Regarding: "${selectedText.slice(0, 200)}${selectedText.length > 200 ? "..." : ""}"\n\nExplain this in more detail.`);
      setShowSendToChat(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  if (!selectedPaper) return null;
  const paper = selectedPaper;

  const goHome = () => {
    setSelectedPaper(null);
    setViewMode("home");
  };

  const zoomIn = () => setZoom((z) => Math.min(z + 10, 200));
  const zoomOut = () => setZoom((z) => Math.max(z - 10, 80));

  return (
    <div className="flex-1 flex flex-col h-full min-w-0 bg-background rounded-xl border border-border shadow-sm overflow-hidden">
      {/* Floating send-to-chat button */}
      {showSendToChat && chatPanelOpen && (
        <div
          className="fixed z-50 animate-in fade-in slide-in-from-bottom-1 duration-150"
          style={{ left: floatingPos.x - 60, top: floatingPos.y - 40 }}
        >
          <button
            onClick={handleSendToChat}
            className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg hover:opacity-90 transition-opacity"
          >
            <Send className="w-3 h-3" />
            Send to Chat
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="px-6 pt-4 pb-1 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <button onClick={goHome} className="hover:text-foreground transition-colors cursor-pointer">Home</button>
          <span className="text-muted-foreground/50">›</span>
          <span className="hover:text-foreground cursor-pointer transition-colors">{paper.theme}</span>
          <span className="text-muted-foreground/50">›</span>
          <span className="text-foreground font-medium">{paper.title.length > 35 ? paper.title.slice(0, 35) + "..." : paper.title}</span>
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
        <div className={`flex items-center bg-secondary rounded-lg px-3 py-1.5 transition-all border ${searchFocused ? "border-muted-foreground/30" : "border-transparent"}`}>
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
            <button onClick={zoomOut} className="px-1 hover:text-foreground transition-colors">−</button>
            <span className="tabular-nums w-8 text-center">{zoom}%</span>
            <button onClick={zoomIn} className="px-1 hover:text-foreground transition-colors">+</button>
          </div>
          <div className="flex bg-secondary rounded-lg overflow-hidden">
            <button
              onClick={() => setPaperViewMode("pdf")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${paperViewMode === "pdf" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >PDF</button>
            <button
              onClick={() => setPaperViewMode("plain")}
              className={`px-2.5 py-1 text-xs font-medium transition-colors ${paperViewMode === "plain" ? "bg-background text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"}`}
            >Plain text</button>
          </div>
          <button className="p-1 hover:bg-accent rounded transition-colors" title="Collapse panel">
            <ArrowRightToLine className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Paper content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-muted/30">
        <div className="px-6 py-5" style={{ fontSize: `${zoom / 132 * 100}%` }}>
          <motion.div
            key={paper.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="max-w-[680px] mx-auto"
          >
            {paperViewMode === "pdf" ? (
              <div className="bg-background border border-border shadow-sm p-8 min-h-[800px] rounded-sm">
                <div className="border-t-2 border-foreground/20 mb-1" />
                <div className="border-t border-foreground/10 mb-6" />

                <h2 className="text-lg font-bold text-center text-foreground leading-snug mb-4">
                  {paper.title}
                </h2>

                <p className="text-[10px] text-center text-muted-foreground leading-relaxed mb-6">
                  {paper.authors.map((a, i) => (
                    <span key={i}>{a} <sup className="text-[8px]">{i === 0 ? "*1" : "1"}</sup>{i < paper.authors.length - 1 ? "   " : ""}</span>
                  ))}
                </p>

                <div className={`gap-5 text-[11px] leading-[1.7] text-foreground/85 ${paper.body.length > 1 ? "grid grid-cols-2" : ""}`}>
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
              <div className="bg-background border border-border shadow-sm p-8 space-y-4 rounded-sm">
                <h2 className="text-lg font-bold text-foreground">{paper.title}</h2>
                <p className="text-xs text-muted-foreground">{paper.authors.join(", ")}</p>
                <div className="flex gap-2 flex-wrap">
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
