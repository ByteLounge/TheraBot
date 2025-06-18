
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";
import { format } from 'date-fns';

export interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp?: Date | number | { seconds: number, nanoseconds: number }; // Allow Firestore Timestamp like structure
  imageUrl?: string; // Optional image URL for user/bot avatar
}

interface ChatMessageProps {
  message: Message;
  userName?: string | null; // Allow null for userName
}

function formatTimestamp(timestamp: Message['timestamp']): string {
  if (!timestamp) return '';
  let date: Date;
  if (typeof timestamp === 'number') {
    date = new Date(timestamp);
  } else if (timestamp instanceof Date) {
    date = timestamp;
  } else if (timestamp && typeof timestamp === 'object' && 'seconds' in timestamp) {
    // Firestore Timestamp like
    date = new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000);
  } else {
    return ''; // Invalid timestamp
  }
  return format(date, 'p'); // e.g., 12:00 PM
}

const getInitialsFallback = (name?: string | null): string => {
  if (!name || name.trim() === "") return "U";
  const parts = name.split(" ").filter(Boolean); // Filter out empty strings from multiple spaces
  if (parts.length === 0) return "U";
  return parts.map(n => n[0]).join("").toUpperCase();
};


export function ChatMessage({ message, userName }: ChatMessageProps) {
  const isUser = message.role === "user";
  const initials = getInitialsFallback(userName);

  return (
    <div
      className={cn(
        "flex items-end gap-2 mb-4 animate-in fade-in-50 slide-in-from-bottom-2 duration-300",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarImage src={message.imageUrl} alt="Bot" data-ai-hint="friendly robot" />
          <AvatarFallback><Bot size={18} /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[70%] rounded-xl px-4 py-3 shadow-md",
          isUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-card text-card-foreground rounded-bl-none border"
        )}
      >
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        {message.timestamp && (
          <p className={cn(
            "text-xs mt-1",
            isUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
          )}>
            {formatTimestamp(message.timestamp)}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 self-start">
          <AvatarImage src={message.imageUrl} alt={userName || "User"} data-ai-hint="profile avatar" />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
