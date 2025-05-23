import { cn } from "@/lib/utils"
import { Brain, User } from "lucide-react"

interface ChatMessageProps {
  message: {
    role: "user" | "assistant"
    content: string
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex items-start gap-3 rounded-lg p-3", isUser ? "bg-muted/50" : "bg-primary/5")}>
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border",
          isUser ? "bg-background" : "bg-primary/10 border-primary/20",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Brain className="h-4 w-4 text-primary" />}
      </div>
      <div className="flex-1 space-y-2">
        <div className="prose prose-sm break-words">
          {message.content.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-2" : ""}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  )
}
