import { useState, useEffect, useRef, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { X, Send, Bot, User, Loader2, Trash2, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// ─── Types ────────────────────────────────────────────────────────────────────

type MessageRole = "user" | "assistant";

interface Message {
  id: string;
  text: string;
  role: MessageRole;
  timestamp: Date;
  status?: "sending" | "sent" | "error" | "streaming";
}

interface ChatAssistantProps {
  onClose: () => void;
}

interface ApiHistoryMessage {
  role: MessageRole;
  content: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "daniyal_chat_history_v2";
const MAX_HISTORY = 40;
const API_BASE_URL = import.meta.env.VITE_RAG_API_URL; // e.g. https://your-app.railway.app

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  text: "Hi! I'm Daniyal's AI portfolio assistant ✦ Ask me about his **experience**, **projects**, **skills**, or **how to get in touch**.",
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
        // Filter out any incomplete streaming messages from a crashed session
        return parsed
          .filter((m) => m.status !== "streaming")
          .map((m) => ({ ...m, timestamp: new Date(m.timestamp) }));
      }
    } catch {
      // ignore parse errors
    }
    return [WELCOME_MESSAGE];
  });

  useEffect(() => {
    const toStore = messages
      .filter((m) => m.status !== "streaming") // don't persist in-progress
      .slice(-MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [messages]);

  const clearMessages = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessages([WELCOME_MESSAGE]);
  }, []);

  return { messages, setMessages, clearMessages };
}

// ─── Markdown renderer ────────────────────────────────────────────────────────

const MarkdownContent = memo(({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      ul: ({ children }) => <ul className="list-disc ml-4 my-1 space-y-0.5">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal ml-4 my-1 space-y-0.5">{children}</ol>,
      li: ({ children }) => <li className="leading-snug">{children}</li>,
      code: ({ children, className }) => {
        const isBlock = className?.includes("language-");
        return isBlock ? (
          <pre className="bg-black/20 rounded-lg p-2 my-1 overflow-x-auto text-xs">
            <code>{children}</code>
          </pre>
        ) : (
          <code className="bg-black/20 px-1 py-0.5 rounded text-xs font-mono">{children}</code>
        );
      },
      hr: () => <hr className="border-white/20 my-2" />,
      em: ({ children }) => <em className="italic">{children}</em>,
      a: ({ href, children }) => (
        <a href={href} target="_blank" rel="noopener noreferrer"
          className="underline underline-offset-2 opacity-80 hover:opacity-100">
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
));

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
  const isStreaming = message.status === "streaming";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed backdrop-blur-sm ${
          isUser
            ? "bg-gradient-to-br from-violet-600 to-purple-700 text-white rounded-tr-sm shadow-lg shadow-violet-900/30"
            : "bg-muted/60 text-foreground border border-border/30 rounded-tl-sm"
        }`}
      >
        <div className="flex items-start gap-2">
          {!isUser && (
            <Bot size={13} className="mt-1 flex-shrink-0 text-violet-400" />
          )}
          {isUser && (
            <User size={13} className="mt-1 flex-shrink-0 opacity-80" />
          )}
          <div className="flex-1 min-w-0">
            {isUser ? (
              <p>{message.text}</p>
            ) : (
              <MarkdownContent content={message.text} />
            )}
            {isStreaming && (
              <motion.span
                className="inline-block w-0.5 h-3.5 bg-violet-400 ml-0.5 rounded-sm align-middle"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              />
            )}
          </div>
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
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const buildHistory = useCallback(
    (currentMessages: Message[]): ApiHistoryMessage[] =>
      currentMessages
        .filter((m) => m.id !== "welcome" && m.status !== "error" && m.status !== "streaming")
        .slice(-16) // last 8 turns (16 messages) for context window
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

    // Create a placeholder for the streaming assistant response
    const assistantMessageId = crypto.randomUUID();
    const assistantPlaceholder: Message = {
      id: assistantMessageId,
      text: "",
      role: "assistant",
      timestamp: new Date(),
      status: "streaming",
    };

    setMessages((prev) => [...prev, userMessage, assistantPlaceholder]);
    setInputValue("");
    setIsLoading(true);

    // Abort any previous request
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    try {
      const history = buildHistory([...messages, userMessage]);

      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorMap: Record<number, string> = {
          429: "Rate limit exceeded. Please wait a moment.",
          500: "Server error. Please try again.",
          503: "Service temporarily unavailable.",
        };
        throw new Error(errorMap[response.status] ?? `HTTP ${response.status}`);
      }

      // ── Read SSE stream ──────────────────────────────────────────────────
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const token = line.slice(6); // strip "data: "
          if (token === "[DONE]") break;
          if (token.startsWith("[ERROR]")) {
            throw new Error(token.slice(8));
          }
          accumulated += token;

          // Update the streaming message in real-time
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessageId
                ? { ...m, text: accumulated }
                : m
            )
          );
        }
      }

      // Mark as fully sent
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId ? { ...m, status: "sent" } : m
        )
      );
    } catch (error) {
      if ((error as Error).name === "AbortError") return;

      const errText =
        error instanceof Error ? error.message : "Something went wrong.";

      toast({
        title: "Connection error",
        description: errText,
        variant: "destructive",
      });

      // Replace streaming placeholder with error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessageId
            ? {
                ...m,
                text: "I'm having trouble connecting right now. Please try again in a moment.",
                status: "error",
              }
            : m
        )
      );
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
    abortControllerRef.current?.abort();
    clearMessages();
    toast({ title: "Chat cleared", description: "Conversation history removed." });
  }, [clearMessages, toast]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: 16 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className="fixed bottom-24 right-6 w-[360px] h-[480px] z-40 flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40"
      style={{ background: "hsl(var(--card) / 0.97)", backdropFilter: "blur(20px)" }}
    >
      {/* ── Header ── */}
      <div className="relative flex items-center gap-2.5 px-4 py-3 border-b border-white/10 bg-gradient-to-r from-violet-600/90 to-purple-700/90 shrink-0">
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
            {isLoading ? "Thinking..." : "RAG-powered · Always online"}
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
      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3 scroll-smooth"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "hsl(var(--border)) transparent",
        }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) =>
            message.status === "streaming" && message.text === "" ? (
              <TypingIndicator key={message.id} />
            ) : (
              <MessageBubble key={message.id} message={message} />
            )
          )}
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
            placeholder="Ask about Daniyal's projects, skills..."
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
          RAG-powered · Answers only from verified context
        </p>
      </div>
    </motion.div>
  );
};

export default ChatAssistant;
