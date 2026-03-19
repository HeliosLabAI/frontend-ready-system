import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Clock, MoreHorizontal, MessageCircle, RotateCcw,
  Share2, ThumbsUp, Copy, X, Send, Sparkles, Loader2
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
        <span key={j} className="inline-flex items-center justify-center w-[18px] h-[18px] mx-0.5 text-[10px] font-medium bg-muted text-muted-foreground rounded-full align-text-bottom cursor-pointer hover:bg-accent transition-colors">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={j}>{part}</span>;
  });
};

export const AIChatPanel = () => {
  const { chatPanelOpen, selectedPaper, chatMessages, addChatMessage, clearChat } = useAppState();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => { scrollToBottom(); }, [chatMessages]);

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

  return (
    <AnimatePresence>
      {chatPanelOpen && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="h-full border border-border bg-background rounded-xl flex flex-col overflow-hidden shrink-0 shadow-sm"
        >
          <div className="min-w-[320px] h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-1.5 px-3 h-11 border-b border-border shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="text-[13px] font-medium text-foreground truncate flex-1">
                Human-AI Interaction (HAX) and...
              </span>
              <button onClick={clearChat} className="p-1 hover:bg-accent rounded transition-colors">
                <Plus className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-accent rounded transition-colors">
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
              <button className="p-1 hover:bg-accent rounded transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-12">
                  <Sparkles className="w-8 h-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">Ask about this paper</p>
                  <p className="text-xs text-muted-foreground/60">Try "summarize", "methodology", or any question</p>
                  <div className="mt-4 space-y-2">
                    {["Summarize key findings", "Explain the methodology", "What are the limitations?"].map((q) => (
                      <button
                        key={q}
                        onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
                        className="block w-full text-left text-xs px-3 py-2 bg-accent/50 hover:bg-accent rounded-md text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`mb-4 ${msg.role === "user" ? "flex justify-end" : ""}`}
                >
                  {msg.role === "user" ? (
                    <div className="bg-primary text-primary-foreground rounded-lg rounded-br-sm px-3 py-2 max-w-[85%] text-[13px]">
                      {msg.content}
                    </div>
                  ) : (
                    <div>
                      <div className="text-[13px] text-foreground/85 leading-relaxed whitespace-pre-wrap">
                        {renderContent(msg.content)}
                      </div>
                      <div className="flex items-center gap-0.5 mt-2 text-muted-foreground">
                        {[MessageCircle, RotateCcw, Share2, ThumbsUp, Copy].map((Icon, i) => (
                          <button key={i} className="p-1 hover:bg-accent rounded transition-colors"><Icon className="w-3.5 h-3.5" /></button>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 py-2">
                  <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                  <span className="text-xs text-muted-foreground">Thinking...</span>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="px-3 pb-3 shrink-0">
              {selectedPaper && (
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-xs text-muted-foreground">@</span>
                  <span className="inline-flex items-center gap-1 bg-accent px-2 py-0.5 rounded text-xs text-foreground">
                    Learning Transferable...
                    <button className="hover:text-destructive shrink-0"><X className="w-3 h-3" /></button>
                  </span>
                </div>
              )}

              <div className="relative border border-border rounded-xl bg-surface-elevated focus-within:border-muted-foreground/30 transition-colors shadow-sm">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask this context a question..."
                  className="w-full bg-transparent px-3 py-2 text-[13px] text-foreground placeholder:text-muted-foreground outline-none pr-10"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Gemini 2.5 Flash</span>
                  <span className="text-[9px]">▾</span>
                </div>
                <span>No limit</span>
                <span className="text-[9px]">▾</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
