import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, BookOpen, ChevronDown, ChevronRight, Gift, MessageSquare,
  HelpCircle, PanelLeftClose, PanelLeft
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { themes } from "@/data/papers";
import { ThemeItem } from "@/types";

const TreeNode = ({ item, depth = 0, activeItem, onSelect }: {
  item: ThemeItem; depth?: number; activeItem: string; onSelect: (name: string) => void;
}) => {
  const [expanded, setExpanded] = useState(
    item.name === "Human-AI Interaction" || item.name === "Transparency & Trust"
  );
  const hasChildren = !!item.children?.length;
  const isActive = activeItem === item.name;

  return (
    <div>
      <button
        onClick={() => {
          if (hasChildren) {
            setExpanded(!expanded);
          }
          onSelect(item.name);
        }}
        className={`w-full flex items-center gap-1.5 py-1.5 pr-2 text-[13px] transition-colors rounded-md
          ${isActive ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {hasChildren ? (
          expanded ? <ChevronDown className="w-3.5 h-3.5 shrink-0" /> : <ChevronRight className="w-3.5 h-3.5 shrink-0" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
        )}
        <span className="truncate">{item.name}</span>
      </button>
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            {item.children!.map((child) => (
              <TreeNode key={child.name} item={child} depth={depth + 1} activeItem={activeItem} onSelect={onSelect} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AppSidebar = () => {
  const { viewMode, setViewMode, setSelectedPaper, activeTheme, setActiveTheme, sidebarCollapsed, setSidebarCollapsed } = useAppState();

  const handleNavClick = (mode: "home" | "library") => {
    setViewMode(mode);
    setSelectedPaper(null);
  };

  return (
    <motion.div
      animate={{ width: sidebarCollapsed ? 0 : 220 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="h-full bg-background rounded-xl border border-border flex flex-col overflow-hidden shrink-0 shadow-sm"
    >
      <div className="min-w-[220px] h-full flex flex-col">
        {/* Nav */}
        <div className="px-2 py-2 space-y-0.5">
          <button
            onClick={() => handleNavClick("home")}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] rounded-md transition-colors
              ${viewMode === "home" ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
          >
            <Home className="w-4 h-4" /> Home
          </button>
          <button
            onClick={() => handleNavClick("library")}
            className={`w-full flex items-center gap-2 px-2 py-1.5 text-[13px] rounded-md transition-colors
              ${viewMode === "library" ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"}`}
          >
            <BookOpen className="w-4 h-4" /> Library
          </button>
        </div>

        {/* Themes */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pt-2">
          <div className="flex items-center justify-between mb-1 px-2">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Themes</span>
            <button className="text-muted-foreground hover:text-foreground text-sm leading-none">+</button>
          </div>
          {themes.map((theme) => (
            <TreeNode key={theme.name} item={theme} activeItem={activeTheme} onSelect={setActiveTheme} />
          ))}
        </div>

        {/* Bottom links */}
        <div className="px-2 py-2 border-t border-border space-y-0.5">
          {[
            { icon: Gift, label: "Invite & Earn" },
            { icon: MessageSquare, label: "Feedback" },
            { icon: HelpCircle, label: "Support" },
          ].map(({ icon: Icon, label }) => (
            <button key={label} className="w-full flex items-center gap-2 px-2 py-1.5 text-[13px] text-muted-foreground hover:bg-accent/50 hover:text-foreground rounded-md transition-colors">
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export const SidebarToggle = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useAppState();
  if (!sidebarCollapsed) return null;

  return (
    <button
      onClick={() => setSidebarCollapsed(false)}
      className="fixed top-14 left-3 z-30 p-1.5 bg-card border border-border rounded-md hover:bg-accent transition-colors shadow-sm"
    >
      <PanelLeft className="w-4 h-4 text-muted-foreground" />
    </button>
  );
};
