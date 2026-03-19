import { Search, ArrowLeft, ArrowRight, ChevronDown, Copy } from "lucide-react";
import { useAppState } from "@/context/AppContext";

export const TopBar = () => {
  const { setSearchOpen, sidebarCollapsed, navigateBack, navigateForward, navigationIndex, navigationHistory } = useAppState();

  return (
    <div className="flex items-center h-11 bg-muted/40 shrink-0 px-3 gap-2">
      {/* User section */}
      <div className={`flex items-center gap-2 shrink-0 transition-all ${sidebarCollapsed ? "w-10" : "w-[220px]"}`}>
        {!sidebarCollapsed && (
          <>
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-semibold shrink-0">SY</div>
            <span className="text-[13px] font-medium text-foreground truncate">Sergey Yani</span>
            <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />
            <button className="p-0.5 hover:bg-accent rounded shrink-0">
              <Copy className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </>
        )}
      </div>

      <div className="w-px h-5 bg-border shrink-0" />

      {/* Nav arrows - functional */}
      <div className="flex items-center gap-0.5">
        <button
          onClick={navigateBack}
          disabled={navigationIndex <= 0}
          className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-30"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <button
          onClick={navigateForward}
          disabled={navigationIndex >= navigationHistory.length - 1}
          className="p-1.5 hover:bg-accent rounded-md transition-colors disabled:opacity-30"
        >
          <ArrowRight className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Centered search */}
      <div className="flex-1 flex justify-center">
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center bg-background hover:bg-accent/50 rounded-lg px-4 py-1.5 w-full max-w-sm transition-colors border border-border"
        >
          <Search className="w-3.5 h-3.5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground flex-1 text-left">Search</span>
          <kbd className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </button>
      </div>

      <div className="w-16 shrink-0" />
    </div>
  );
};
