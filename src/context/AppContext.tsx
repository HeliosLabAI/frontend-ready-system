import React, { createContext, useContext, useState, ReactNode } from "react";
import { ViewMode, Paper, ChatMessage } from "@/types";
import { papers as defaultPapers } from "@/data/papers";

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
  // New features
  allPapers: Paper[];
  addPaper: (paper: Paper) => void;
  chatContextPaper: Paper | null;
  setChatContextPaper: (paper: Paper | null) => void;
  selectedTextForChat: string;
  setSelectedTextForChat: (text: string) => void;
  navigationHistory: Paper[];
  navigationIndex: number;
  navigateBack: () => void;
  navigateForward: () => void;
}

const AppContext = createContext<AppState | null>(null);

export const useAppState = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppState must be used within AppProvider");
  return ctx;
};

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
  const [selectedPaper, setSelectedPaperState] = useState<Paper | null>(defaultPapers[0]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatPanelOpen, setChatPanelOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [activeTheme, setActiveTheme] = useState("Human-AI Interaction");
  const [allPapers, setAllPapers] = useState<Paper[]>(defaultPapers);
  const [chatContextPaper, setChatContextPaper] = useState<Paper | null>(defaultPapers[0]);
  const [selectedTextForChat, setSelectedTextForChat] = useState("");
  const [navigationHistory, setNavigationHistory] = useState<Paper[]>([defaultPapers[0]]);
  const [navigationIndex, setNavigationIndex] = useState(0);

  const addChatMessage = (msg: ChatMessage) => setChatMessages((prev) => [...prev, msg]);
  const clearChat = () => setChatMessages([]);

  const addPaper = (paper: Paper) => {
    setAllPapers((prev) => [paper, ...prev]);
  };

  const setSelectedPaper = (paper: Paper | null) => {
    setSelectedPaperState(paper);
    if (paper) {
      setViewMode("paper");
      setChatContextPaper(paper);
      setNavigationHistory((prev) => {
        const newHistory = prev.slice(0, navigationIndex + 1);
        return [...newHistory, paper];
      });
      setNavigationIndex((prev) => prev + 1);
    }
  };

  const navigateBack = () => {
    if (navigationIndex > 0) {
      const newIndex = navigationIndex - 1;
      setNavigationIndex(newIndex);
      const paper = navigationHistory[newIndex];
      setSelectedPaperState(paper);
      setChatContextPaper(paper);
      setViewMode("paper");
    }
  };

  const navigateForward = () => {
    if (navigationIndex < navigationHistory.length - 1) {
      const newIndex = navigationIndex + 1;
      setNavigationIndex(newIndex);
      const paper = navigationHistory[newIndex];
      setSelectedPaperState(paper);
      setChatContextPaper(paper);
      setViewMode("paper");
    }
  };

  const handleSetViewMode = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return (
    <AppContext.Provider
      value={{
        viewMode, setViewMode: handleSetViewMode,
        selectedPaper, setSelectedPaper,
        sidebarCollapsed, setSidebarCollapsed,
        chatPanelOpen, setChatPanelOpen,
        searchOpen, setSearchOpen,
        chatMessages, addChatMessage, clearChat,
        activeTheme, setActiveTheme,
        allPapers, addPaper,
        chatContextPaper, setChatContextPaper,
        selectedTextForChat, setSelectedTextForChat,
        navigationHistory, navigationIndex,
        navigateBack, navigateForward,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
