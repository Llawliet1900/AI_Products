"use client"

import { useRef } from "react"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Brain, FileText, Send } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UsageDisplay } from "@/components/usage-display"
import { ChatMessage } from "@/components/chat-message"
import { NoteSelectionModal } from "@/components/note-selection-modal"
import { ModelSelector } from "@/components/model-selector"
import { WebSearchToggle } from "@/components/web-search-toggle"
import { useAppStore, type Conversation } from "@/lib/store"

// 模拟笔记数据
const initialNotes = [
  {
    id: "1",
    title: "机器学习基础",
    content: "机器学习是人工智能的一个分支，主要研究计算机怎样模拟或实现人类的学习行为...",
  },
  {
    id: "2",
    title: "深度学习框架比较",
    content: "本文比较了TensorFlow、PyTorch和JAX等主流深度学习框架的优缺点...",
  },
  {
    id: "3",
    title: "自然语言处理入门",
    content: "自然语言处理(NLP)是计算机科学、人工智能和语言学的交叉学科...",
  },
]

// 模拟AI回答
const aiResponses = {
  机器学习是什么:
    "根据笔记《机器学习基础》中的内容：机器学习是人工智能的一个分支，主要研究计算机怎样模拟或实现人类的学习行为，以获取新的知识或技能，重新组织已有的知识结构使之不断改善自身的性能。它是人工智能的核心，是使计算机具有智能的根本途径。",
  比较一下深度学习框架:
    "根据笔记《深度学习框架比较》中的内容：TensorFlow的优点是生产环境部署成熟，支持移动设备，有完善的可视化工具；缺点是API变化较大，调试困难。PyTorch的优点是动态计算图便于调试，API友好，研究领域应用广泛；缺点是移动端支持不如TensorFlow，生产部署相对复杂。JAX的优点是函数式编程风格，优秀的自动微分能力，与NumPy兼容性好；缺点是生态系统相对不成熟，学习曲线较陡峭。",
  NLP的主要任务有哪些:
    "根据笔记《自然语言处理入门》中的内容：NLP的主要任务包括：1. 文本分类：将文本分为预定义的类别；2. 命名实体识别：识别文本中的实体（人名、地名等）；3. 情感分析：判断文本的情感倾向；4. 机器翻译：在不同语言间转换文本；5. 问答系统：回答用户的自然语言问题；6. 文本摘要：生成文本的简短摘要；7. 对话系统：与用户进行自然语言对话。",
}

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export default function AIChat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const noteId = searchParams.get("noteId")
  const { addConversation } = useAppStore()

  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>(noteId ? [noteId] : [])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isNoteSelectionOpen, setIsNoteSelectionOpen] = useState(false)
  const [usageStats, setUsageStats] = useState({
    queryCount: 0,
    queryLimit: 5,
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (noteId) {
      const note = initialNotes.find((note) => note.id === noteId)
      if (note) {
        setMessages([
          {
            id: "system-1",
            role: "assistant",
            content: `我已加载笔记《${note.title}》，您可以向我提问关于这个笔记的内容。`,
            timestamp: new Date().toISOString(),
          },
        ])
      }
    } else {
      setMessages([
        {
          id: "system-1",
          role: "assistant",
          content: "您好，我是Notella的AI助手。请选择要加载的笔记开始对话，或直接向我提问。",
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [noteId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      timestamp: new Date().toISOString(),
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
      let response = "我无法回答这个问题，因为我没有找到相关的笔记内容。"

      // 简单匹配预设回答
      for (const [key, value] of Object.entries(aiResponses)) {
        if (input.toLowerCase().includes(key.toLowerCase())) {
          response = value
          break
        }
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
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

    const selectedNoteNames = initialNotes
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
        timestamp: new Date().toISOString(),
      },
    ])

    toast({
      title: "笔记已加载",
      description:
        selectedIds.length === 1 ? `已加载笔记《${selectedNoteNames}》` : `已加载${selectedIds.length}条笔记`,
    })
  }

  useEffect(() => {
    // Create a new conversation and redirect to it
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: "新对话",
      noteIds: selectedNoteIds,
      messages: messages,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addConversation(newConversation)
    router.push(`/dashboard/ai/${newConversation.id}`)
  }, [selectedNoteIds, messages])

  return (
    <DashboardShell>
      <DashboardHeader
        heading="AI对话"
        text="与您的笔记进行对话，AI助手会基于您的笔记内容回答问题"
        isSubscribed={isSubscribed}
        onUpgrade={() => router.push("/pricing")}
      />
      <div className="grid gap-4">
        {!isSubscribed && (
          <UsageDisplay
            title="AI对话使用情况"
            current={usageStats.queryCount}
            limit={usageStats.queryLimit}
            isUnlimited={isSubscribed}
            type="queries"
          />
        )}

        <Card className="flex flex-col h-[calc(100vh-300px)]">
          <CardHeader className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">AI助手</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => setIsNoteSelectionOpen(true)}>
                  <FileText className="mr-2 h-4 w-4" />
                  加载笔记
                </Button>
                <ModelSelector isSubscribed={isSubscribed} />
                <WebSearchToggle isSubscribed={isSubscribed} />
              </div>
            </div>
            <CardDescription>{isSubscribed ? "使用高级模型 (GPT-4o)" : "使用基础模型 (DeepSeek v2)"}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4">
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
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
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
          </CardFooter>
        </Card>
      </div>

      <NoteSelectionModal
        notes={initialNotes}
        selectedNoteIds={selectedNoteIds}
        open={isNoteSelectionOpen}
        onOpenChange={setIsNoteSelectionOpen}
        onConfirm={handleNoteSelectionConfirm}
      />
    </DashboardShell>
  )
}
