"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ChevronDown, ChevronUp, FileText, Send } from "lucide-react"
import { ChatMessage } from "@/components/chat-message"
import { NoteSelectionModal } from "@/components/note-selection-modal"
import { ModelSelector } from "@/components/model-selector"
import { WebSearchToggle } from "@/components/web-search-toggle"

interface Note {
  id: string
  title: string
}

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface EmbeddedChatProps {
  notes: Note[]
  currentNoteId: string
  isSubscribed: boolean
}

export function EmbeddedChat({ notes, currentNoteId, isSubscribed }: EmbeddedChatProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([currentNoteId])
  const [isNoteSelectionOpen, setIsNoteSelectionOpen] = useState(false)
  const [usageStats, setUsageStats] = useState({
    queryCount: 0,
    queryLimit: 5,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom()
    }
  }, [messages, isExpanded])

  useEffect(() => {
    // Initialize with the current note
    if (!messages.length) {
      const currentNote = notes.find((note) => note.id === currentNoteId)
      if (currentNote) {
        setMessages([
          {
            id: "system-1",
            role: "assistant",
            content: `我已加载笔记《${currentNote.title}》，您可以向我提问关于这个笔记的内容。`,
          },
        ])
      }
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!input.trim()) return

    // 检查使用限制
    if (!isSubscribed && usageStats.queryCount >= usageStats.queryLimit) {
      toast({
        title: "AI对话次数已达上限",
        description: "免费用户每日最多可进行5次AI对话，请升级到付费版解锁更多功能",
        variant: "destructive",
      })
      return
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // 更新使用统计
    setUsageStats((prev) => ({
      ...prev,
      queryCount: prev.queryCount + 1,
    }))

    // 模拟AI回答
    setTimeout(() => {
      const selectedNotes = notes.filter((note) => selectedNoteIds.includes(note.id))
      const noteTitle = selectedNotes.length === 1 ? selectedNotes[0].title : `${selectedNotes.length}条笔记`

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: `根据笔记《${noteTitle}》中的内容：这是一个模拟的AI回答，实际应用中会基于您的笔记内容生成回答。您的问题是："${input}"，在实际应用中，AI会分析您的笔记并提供相关信息。`,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleNoteSelectionConfirm = (selectedIds: string[]) => {
    if (selectedIds.length === 0) {
      toast({
        title: "请至少选择一个笔记",
        description: "需要至少一个笔记来进行AI对话",
        variant: "destructive",
      })
      return
    }

    setSelectedNoteIds(selectedIds)

    const selectedNoteNames = notes
      .filter((note) => selectedIds.includes(note.id))
      .map((note) => note.title)
      .join("、")

    const message =
      selectedIds.length === 1
        ? `已加载笔记《${selectedNoteNames}》`
        : `已加载${selectedIds.length}条笔记：${selectedNoteNames}`

    setMessages([
      {
        id: `system-${Date.now()}`,
        role: "assistant",
        content: message,
      },
    ])

    toast({
      title: "笔记已加载",
      description:
        selectedIds.length === 1 ? `已加载笔记《${selectedNoteNames}》` : `已加载${selectedIds.length}条笔记`,
    })
  }

  if (!isExpanded) {
    return (
      <div className="border-t mt-4 pt-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary"
          onClick={() => setIsExpanded(true)}
        >
          <ChevronUp className="h-4 w-4" />
          AI对话
        </Button>
      </div>
    )
  }

  return (
    <div
      className="fixed bottom-0 left-64 right-0 bg-background border-t shadow-lg transition-all duration-300 z-10"
      style={{ height: isExpanded ? "40vh" : "auto" }}
    >
      <div className="flex items-center justify-between p-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsNoteSelectionOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            加载笔记
          </Button>
          <ModelSelector isSubscribed={isSubscribed} />
          <WebSearchToggle isSubscribed={isSubscribed} />
        </div>
        <Button variant="ghost" size="icon" onClick={() => setIsExpanded(false)}>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex flex-col h-[calc(40vh-110px)]">
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full"></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full animation-delay-200"></div>
                  <div className="animate-bounce h-2 w-2 bg-gray-400 rounded-full animation-delay-400"></div>
                </div>
                <span>AI助手正在思考...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Textarea
              placeholder="输入您的问题..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="min-h-[60px] resize-none"
            />
            <Button size="icon" onClick={handleSendMessage} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">发送</span>
            </Button>
          </div>
          {!isSubscribed && (
            <div className="mt-2 text-xs text-muted-foreground">
              今日剩余: {usageStats.queryLimit - usageStats.queryCount} / {usageStats.queryLimit} 次对话
            </div>
          )}
        </div>
      </div>

      <NoteSelectionModal
        notes={notes}
        selectedNoteIds={selectedNoteIds}
        open={isNoteSelectionOpen}
        onOpenChange={setIsNoteSelectionOpen}
        onConfirm={handleNoteSelectionConfirm}
      />
    </div>
  )
}
