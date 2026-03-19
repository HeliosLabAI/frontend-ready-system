import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Plus, Clock, MoreHorizontal, MessageCircle, RotateCcw,
  Share2, ThumbsUp, Copy, X, Send, Sparkles, Loader2, FileText
} from "lucide-react";
import { useAppState } from "@/context/AppContext";
import { ChatMessage } from "@/types";
import { AI_RESPONSES } from "@/data/papers";

const renderContent = (content: string) => {
  return content.split(/(\*\*[^*]+\*\*|\[\d+\])/).map((part, j) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={j} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
    }
    if (/^\[\d+\]$/.test(part)) {
      return (
        <span key={j} className="inline-flex items-center justify-center w-[18px] h-[18px] mx-0.5 text-[10px] font-medium bg-secondary text-muted-foreground rounded-full align-text-bottom cursor-pointer hover:bg-accent transition-colors">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={j}>{part}</span>;
  });
};

export const AIChatPanel = () => {
  const {
    chatPanelOpen, selectedPaper, chatMessages, addChatMessage, clearChat,
    allPapers, chatContextPaper, setChatContextPaper,
    selectedTextForChat, setSelectedTextForChat
  } = useAppState();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showAtMenu, setShowAtMenu] = useState(false);
  const [atQuery, setAtQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [chatMessages]);

  // Handle selected text from paper
  useEffect(() => {
    if (selectedTextForChat) {
      setInput(selectedTextForChat);
      setSelectedTextForChat("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [selectedTextForChat, setSelectedTextForChat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInput(val);

    // Detect @ trigger
    const atIndex = val.lastIndexOf("@");
    if (atIndex !== -1 && (atIndex === 0 || val[atIndex - 1] === " ")) {
      const query = val.slice(atIndex + 1);
      if (!query.includes(" ")) {
        setShowAtMenu(true);
        setAtQuery(query);
        return;
      }
    }
    setShowAtMenu(false);
    setAtQuery("");
  };

  const filteredPapers = allPapers.filter((p) =>
    !atQuery || p.title.toLowerCase().includes(atQuery.toLowerCase())
  ).slice(0, 5);

  const selectAtPaper = (paper: typeof allPapers[0]) => {
    setChatContextPaper(paper);
    // Remove @query from input
    const atIndex = input.lastIndexOf("@");
    setInput(input.slice(0, atIndex));
    setShowAtMenu(false);
    setAtQuery("");
    inputRef.current?.focus();
  };

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input.trim(), timestamp: new Date() };
    addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);

    const responseKey = input.toLowerCase().includes("summary") ? "summary"
      : input.toLowerCase().includes("method") ? "methodology" : "default";

    setTimeout(() => {
      addChatMessage({
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: AI_RESPONSES[responseKey],
        timestamp: new Date(),
      });
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  if (!chatPanelOpen) return null;

  return (
    <div className="w-[340px] h-full border border-border bg-background rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5 px-3 h-11 border-b border-border shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        <span className="text-[13px] font-medium text-foreground truncate flex-1">
          {chatContextPaper ? chatContextPaper.title.slice(0, 30) + "..." : "AI Chat"}
        </span>
        <button onClick={clearChat} className="p-1 hover:bg-accent rounded transition-colors" title="New chat">
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button className="p-1 hover:bg-accent rounded transition-colors" title="History">
          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
        <button className="p-1 hover:bg-accent rounded transition-colors" title="More">
          <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
        {chatMessages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-1">Ask about this paper</p>
            <p className="text-xs text-muted-foreground/60">Try "summarize", "methodology", or any question</p>
            <div className="mt-4 space-y-2">
              {["Summarize key findings", "Explain the methodology", "What are the limitations?"].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                  className="block w-full text-left text-xs px-3 py-2 bg-accent/50 hover:bg-accent rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className={`mb-4 ${msg.role === "user" ? "flex justify-end" : ""}`}
          >
            {msg.role === "user" ? (
              <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-md px-3.5 py-2.5 max-w-[85%] text-[13px] leading-relaxed">
                {msg.content}
              </div>
            ) : (
              <div>
                <div className="text-[13px] text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {renderContent(msg.content)}
                </div>
                <div className="flex items-center gap-0.5 mt-2 text-muted-foreground">
                  {[
                    { Icon: Copy, action: () => copyToClipboard(msg.content), title: "Copy" },
                    { Icon: RotateCcw, action: () => {}, title: "Regenerate" },
                    { Icon: ThumbsUp, action: () => {}, title: "Like" },
                    { Icon: Share2, action: () => {}, title: "Share" },
                  ].map(({ Icon, action, title }, i) => (
                    <button key={i} onClick={action} title={title} className="p-1 hover:bg-accent rounded transition-colors">
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 py-2">
            <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
            <span className="text-xs text-muted-foreground">Thinking...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-3 pb-3 shrink-0">
        {/* Context paper indicator */}
        {chatContextPaper && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs text-muted-foreground">@</span>
            <span className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 rounded-md text-xs text-foreground">
              <FileText className="w-3 h-3 text-muted-foreground" />
              {chatContextPaper.title.length > 25 ? chatContextPaper.title.slice(0, 25) + "..." : chatContextPaper.title}
              <button onClick={() => setChatContextPaper(null)} className="hover:text-destructive shrink-0 ml-0.5">
                <X className="w-3 h-3" />
              </button>
            </span>
          </div>
        )}

        <div className="relative">
          {/* @ mention dropdown */}
          {showAtMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-1 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-10">
              <div className="px-3 py-1.5 text-[11px] text-muted-foreground border-b border-border font-medium">
                Switch paper context
              </div>
              {filteredPapers.map((paper) => (
                <button
                  key={paper.id}
                  onClick={() => selectAtPaper(paper)}
                  className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent/50 transition-colors text-left"
                >
                  <FileText className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-foreground truncate">{paper.title}</p>
                    <p className="text-[10px] text-muted-foreground">{paper.authors[0]}</p>
                  </div>
                </button>
              ))}
              {filteredPapers.length === 0 && (
                <div className="px-3 py-3 text-xs text-muted-foreground text-center">No papers found</div>
              )}
            </div>
          )}

          <div className="border border-border rounded-xl bg-card focus-within:border-muted-foreground/30 transition-colors shadow-sm">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !showAtMenu) handleSend();
                if (e.key === "Escape") setShowAtMenu(false);
              }}
              placeholder="Ask about this paper... (@ to switch)"
              className="w-full bg-transparent px-3.5 py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground outline-none pr-10"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all hover:bg-accent rounded-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Gemini 2.5 Flash</span>
            <span className="text-[9px]">▾</span>
          </div>
          <span>No limit</span>
        </div>
      </div>
    </div>
  );
};
