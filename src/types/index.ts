export interface Paper {
  id: string;
  title: string;
  authors: string[];
  abstract: string;
  body: string[];
  date: string;
  theme: string;
  subtheme?: string;
  tags: string[];
  citationCount: number;
}

export interface ThemeItem {
  name: string;
  children?: ThemeItem[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ViewMode = "home" | "library" | "paper";
export type PaperViewMode = "pdf" | "plain";
