import React, { createContext, useContext, useState, ReactNode } from "react";
import { ViewMode, Paper, ChatMessage } from "@/types";
import { papers, AI_RESPONSES } from "@/data/papers";

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

// Pre-loaded AI chat content to match reference
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    content: `**4. Data-Driven UX and Model Feedback Loops:**
This concept focuses on using user data and feedback to continuously improve both the user experience and the AI model's performance. This extends traditional UX practices by incorporating user feedback into model training (human-in-the-loop learning) [6]. Key aspects include identifying relevant metrics for AI features (accuracy, confidence, satisfaction), designing interfaces for explicit feedback (e.g., thumbs up/down), and using implicit feedback (user behavior) to inform design decisions [6]. Treating data as a design material, presenting model outputs with uncertainty, logging interactions, and monitoring AI in production are also vital [6].

These concepts collectively illustrate a shift towards more intelligent, adaptive, and collaborative human-AI interactions, emphasizing user-centered design, ethical considerations, and continuous improvement through data and feedback [7], [8].`,
    timestamp: new Date(),
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("paper");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(papers[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
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
