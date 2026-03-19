import { AppProvider, useAppState } from "@/context/AppContext";
import { AppSidebar, SidebarToggle } from "@/components/AppSidebar";
import { HomeView } from "@/components/HomeView";
import { LibraryView } from "@/components/LibraryView";
import { DocumentViewer } from "@/components/DocumentViewer";
import { AIChatPanel } from "@/components/AIChatPanel";
import { GlobalSearch } from "@/components/GlobalSearch";

const AppLayout = () => {
  const { viewMode, searchOpen, setSearchOpen } = useAppState();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      <SidebarToggle />
      <AppSidebar />
      
      {viewMode === "home" && <HomeView />}
      {viewMode === "library" && <LibraryView />}
      {viewMode === "paper" && <DocumentViewer />}
      
      {viewMode === "paper" && <AIChatPanel />}

      <GlobalSearch />

      {/* Keyboard shortcut hint */}
      {viewMode !== "paper" && (
        <button
          onClick={() => setSearchOpen(true)}
          className="fixed bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-md text-xs text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 transition-all"
        >
          <span>Search</span>
          <kbd className="bg-muted px-1.5 py-0.5 rounded text-[10px]">⌘K</kbd>
        </button>
      )}
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <AppLayout />
  </AppProvider>
);

export default Index;
