import { AppProvider, useAppState } from "@/context/AppContext";
import { AppSidebar, SidebarToggle } from "@/components/AppSidebar";
import { HomeView } from "@/components/HomeView";
import { LibraryView } from "@/components/LibraryView";
import { DocumentViewer } from "@/components/DocumentViewer";
import { AIChatPanel } from "@/components/AIChatPanel";
import { GlobalSearch } from "@/components/GlobalSearch";
import { TopBar } from "@/components/TopBar";

const AppLayout = () => {
  const { viewMode } = useAppState();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-muted/40">
      <TopBar />

      <div className="flex flex-1 min-h-0 overflow-hidden px-1.5 pb-1.5 gap-1.5">
        <SidebarToggle />
        <AppSidebar />

        <div className="flex flex-1 min-w-0 gap-1.5">
          {viewMode === "home" && <HomeView />}
          {viewMode === "library" && <LibraryView />}
          {viewMode === "paper" && (
            <>
              <DocumentViewer />
              <AIChatPanel />
            </>
          )}
        </div>
      </div>

      <GlobalSearch />
    </div>
  );
};

const Index = () => (
  <AppProvider>
    <AppLayout />
  </AppProvider>
);

export default Index;
