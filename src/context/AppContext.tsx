import React, { createContext, useContext, useState, ReactNode } from "react";
import { ViewMode, Paper, ChatMessage } from "@/types";
import { papers } from "@/data/papers";

interface AppState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  selectedPaper: Paper | null;
  setSelectedPaper: (paper: Paper | null) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  chatPanelOpen: boolean;
  setChatPanelOpen: (open: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
  activeTheme: string;
  setActiveTheme: (theme: string) => void;
}

const AppContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [activeTheme, setActiveTheme] = useState("Human-AI Interaction");

  const addChatMessage = (msg: ChatMessage) => setChatMessages((prev) => [...prev, msg]);
  const clearChat = () => setChatMessages([]);

  const handleSelectPaper = (paper: Paper | null) => {
    setSelectedPaper(paper);
    if (paper) setViewMode("paper");
  };

  return (
    <AppContext.Provider
      value={{
        viewMode, setViewMode,
        selectedPaper, setSelectedPaper: handleSelectPaper,
        sidebarCollapsed, setSidebarCollapsed,
        chatPanelOpen, setChatPanelOpen,
        searchOpen, setSearchOpen,
        chatMessages, addChatMessage, clearChat,
        activeTheme, setActiveTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
