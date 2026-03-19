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
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      {/* Top header bar spanning full width */}
      <TopBar />

      {/* Main content area below header */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <SidebarToggle />
        <AppSidebar />

        {viewMode === "home" && <HomeView />}
        {viewMode === "library" && <LibraryView />}
        {viewMode === "paper" && <DocumentViewer />}

        {viewMode === "paper" && <AIChatPanel />}
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
