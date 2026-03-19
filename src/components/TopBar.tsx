import { Search, ArrowLeft, ArrowRight } from "lucide-react";
import { useAppState } from "@/context/AppContext";

export const TopBar = () => {
  const { setSearchOpen, sidebarCollapsed } = useAppState();

  return (
    <div className="flex items-center h-12 bg-muted/40 shrink-0 px-4 gap-3">
      {/* Left section: spacer for sidebar width alignment */}
      <div className={`flex items-center gap-2 shrink-0 transition-all ${sidebarCollapsed ? "w-8" : "w-[244px]"}`}>
        {/* This space aligns with sidebar below */}
      </div>

      {/* Nav arrows */}
      <div className="flex items-center gap-1">
        <button className="p-1.5 hover:bg-accent rounded-md transition-colors">
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button className="p-1.5 hover:bg-accent rounded-md transition-colors">
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Centered search */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center bg-background hover:bg-accent rounded-xl px-4 py-1.5 w-full max-w-md transition-colors border border-border hover:border-muted-foreground/20 shadow-sm"
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Search</span>
          <kbd className="ml-auto text-[10px] text-muted-foreground/60 bg-background px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
        </button>
      </div>

      {/* Right spacer */}
      <div className="w-20 shrink-0" />
    </div>
  );
};
