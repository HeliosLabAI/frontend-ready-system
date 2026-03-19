import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Search, Grid3X3, List, SortAsc, Calendar, Hash,
  Upload, Plus, X
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { Paper } from "@/types";

export const LibraryView = () => {
  const { setSelectedPaper, allPapers, addPaper } = useAppState();
  const [query, setQuery] = useState("");
  const [layout, setLayout] = useState<"list" | "grid">("list");
  const [sortBy, setSortBy] = useState<"date" | "citations" | "title">("date");
  const [showUpload, setShowUpload] = useState(false);

  let filtered = allPapers.filter((p) =>
    !query || p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.authors.some((a) => a.toLowerCase().includes(query.toLowerCase())) ||
    p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "date") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortBy === "citations") return b.citationCount - a.citationCount;
    return a.title.localeCompare(b.title);
  });

  const themes = [...new Set(allPapers.map((p) => p.theme))];

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin bg-background rounded-xl border border-border shadow-sm">
      <div className="max-w-4xl mx-auto px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center justify-between mb-1">
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Library</h1>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:opacity-90 transition-opacity"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload Paper
            </button>
          </div>
          <p className="text-sm text-muted-foreground mb-6">{allPapers.length} papers across {themes.length} themes</p>
        </motion.div>

        {/* Upload modal */}
        <AnimatePresence>
          {showUpload && (
            <UploadModal onClose={() => setShowUpload(false)} onUpload={addPaper} />
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 flex items-center bg-secondary rounded-lg px-3 py-2 border border-transparent focus-within:border-muted-foreground/30 transition-colors">
            <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter papers..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center bg-secondary rounded-lg overflow-hidden border border-transparent">
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

          <div className="flex items-center bg-secondary rounded-lg overflow-hidden border border-transparent">
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
            {filtered.length === 0 && (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">No papers found</div>
            )}
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

const UploadModal = ({ onClose, onUpload }: { onClose: () => void; onUpload: (paper: Paper) => void }) => {
  const [title, setTitle] = useState("");
  const [authors, setAuthors] = useState("");
  const [abstract, setAbstract] = useState("");
  const [theme, setTheme] = useState("Human-AI Interaction");
  const [tags, setTags] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const paper: Paper = {
      id: `uploaded-${Date.now()}`,
      title: title.trim(),
      authors: authors.split(",").map((a) => a.trim()).filter(Boolean),
      abstract: abstract.trim() || "No abstract provided.",
      body: [],
      date: new Date().toISOString().slice(0, 10),
      theme,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      citationCount: 0,
      isUploaded: true,
    };
    onUpload(paper);
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-foreground">Upload Paper</h2>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          {/* File upload area */}
          <div
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-muted-foreground/40 hover:bg-accent/30 transition-colors"
          >
            <Upload className="w-8 h-8 text-muted-foreground/40 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{fileName || "Click to upload PDF"}</p>
            <p className="text-xs text-muted-foreground/60 mt-1">PDF, up to 20MB</p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Title *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Paper title"
              className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-muted-foreground/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Authors</label>
            <input
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="Comma-separated (e.g. John Doe, Jane Smith)"
              className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-muted-foreground/30"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground mb-1 block">Abstract</label>
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Paper abstract..."
              rows={3}
              className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-muted-foreground/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none border border-transparent focus:border-muted-foreground/30"
              >
                <option>Human-AI Interaction</option>
                <option>Collaborative AI Systems</option>
                <option>Conversational AI</option>
                <option>AI UX Frameworks</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma-separated"
                className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none border border-transparent focus:border-muted-foreground/30"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Add Paper
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
      {paper.isUploaded && (
        <span className="text-[9px] px-1.5 py-0.5 bg-accent rounded text-muted-foreground shrink-0">Uploaded</span>
      )}
    </div>
    <span className="text-xs text-muted-foreground truncate">{paper.authors[0] || "Unknown"}</span>
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
      <span className="text-[11px] text-muted-foreground">{paper.authors[0] || "Unknown"} · {paper.date.slice(0, 4)}</span>
      <div className="flex gap-1">
        {paper.tags.slice(0, 2).map((tag) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-accent rounded text-muted-foreground">{tag}</span>
        ))}
      </div>
    </div>
  </motion.button>
);
