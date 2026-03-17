import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  text: string;
  role: MessageRole;
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

interface ChatAssistantProps {
  onClose: () => void;
}

interface ApiMessage {
  role: MessageRole;
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "daniyal_chat_history";
const MAX_HISTORY = 50;

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Hi! I'm Daniyal's AI assistant ✦ Ask me anything about his experience, skills, projects, or how to get in touch.",
  role: "assistant",
  timestamp: new Date(),
  status: "sent",
};

// ─── Hooks ────────────────────────────────────────────────────────────────────

function usePersistedMessages() {
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Message[];
        return parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {
      // ignore parse errors
    }
    return [WELCOME_MESSAGE];
  });

  useEffect(() => {
    const toStore = messages.slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [messages]);

  const clearMessages = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, setMessages, clearMessages };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TypingIndicator = memo(() => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 8 }}
    className="flex justify-start"
  >
    <div className="flex items-center gap-2 bg-muted/60 border border-border/30 backdrop-blur-sm px-4 py-3 rounded-2xl rounded-tl-sm">
      <Bot size={13} className="text-violet-400 flex-shrink-0" />
      <div className="flex gap-1 items-center">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-violet-400"
            animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
    </div>
  </motion.div>
));

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble = memo(({ message }: MessageBubbleProps) => {
  const isUser = message.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-tr-sm shadow-lg shadow-violet-900/30"
            : "bg-muted/60 text-foreground border border-border/30 rounded-tl-sm"
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <Bot size={13} className="mt-0.5 flex-shrink-0 text-violet-400" />
          )}
          {isUser && (
            <User size={13} className="mt-0.5 flex-shrink-0 opacity-80" />
          )}
          <p>{message.text}</p>
        </div>
        {message.status === "error" && (
          <p className="text-xs mt-1 opacity-60 text-red-400">⚠ Failed to send</p>
        )}
      </div>
    </motion.div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

const ChatAssistant = ({ onClose }: ChatAssistantProps) => {
  const { messages, setMessages, clearMessages } = usePersistedMessages();
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Focus input on open
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const buildHistory = useCallback(
    (currentMessages: Message[]): ApiMessage[] =>
      currentMessages
        .filter((m) => m.id !== "welcome" && m.status !== "error")
        .map((m) => ({ role: m.role, content: m.text })),
    []
  );

  const handleSendMessage = useCallback(async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      role: "user",
      timestamp: new Date(),
      status: "sent",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const history = buildHistory([...messages, userMessage]);

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/portfolio-chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ message: text, history }),
        }
      );

      if (!response.ok) {
        const errorMap: Record<number, string> = {
          429: "Rate limit exceeded. Please wait a moment.",
          402: "AI service temporarily unavailable.",
          500: "Server error. Please try again.",
        };
        throw new Error(errorMap[response.status] ?? "Failed to get response.");
      }

      const data = await response.json();

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.response,
        role: "assistant",
        timestamp: new Date(),
        status: "sent",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errText =
        error instanceof Error ? error.message : "Something went wrong.";

      toast({
        title: "Connection error",
        description: errText,
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: crypto.randomUUID(),
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
        status: "error",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }, [inputValue, isLoading, messages, buildHistory, setMessages, toast]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const handleClear = useCallback(() => {
    clearMessages();
    toast({ title: "Chat cleared", description: "Conversation history removed." });
  }, [clearMessages, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="fixed bottom-24 right-6 w-[340px] h-[440px] z-40 flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40"
      style={{ background: "hsl(var(--card) / 0.97)", backdropFilter: "blur(20px)" }}
    >
      {/* ── Header ── */}
      <div className="relative flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-violet-600/90 to-purple-700/90 shrink-0">
        {/* Subtle shimmer line */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
        />
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/15">
          <Sparkles size={14} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white leading-none">Daniyal's Assistant</p>
          <p className="text-[10px] text-white/60 mt-0.5">
            {isLoading ? "Thinking..." : "Online"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/15 rounded-lg"
            title="Clear chat"
          >
            <Trash2 size={13} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-white/60 hover:text-white hover:bg-white/15 rounded-lg"
            title="Close"
          >
            <X size={14} />
          </Button>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "hsl(var(--border)) transparent",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isLoading && <TypingIndicator key="typing" />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ── */}
      <div className="px-3 pb-3 pt-2 border-t border-white/8 shrink-0 bg-background/60 backdrop-blur-sm">
        <div className="flex gap-2 items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about Daniyal..."
            disabled={isLoading}
            maxLength={500}
            className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-border/40 bg-background/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/40 transition-all disabled:opacity-50 caret-violet-400"
          />
          <motion.div whileTap={{ scale: 0.92 }}>
            <Button
              onClick={handleSendMessage}
              size="icon"
              disabled={isLoading || !inputValue.trim()}
              className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 hover:opacity-90 transition-opacity shadow-md shadow-violet-900/30 disabled:opacity-40"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Send size={15} />
              )}
            </Button>
          </motion.div>
        </div>
        <p className="text-[10px] text-muted-foreground/40 mt-1.5 text-center">
          Powered by AI · Knows everything about Daniyal
        </p>
      </div>
    </motion.div>
  );
};

export default ChatAssistant;
