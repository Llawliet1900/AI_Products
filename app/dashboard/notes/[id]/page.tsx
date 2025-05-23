"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, MessageSquare, Save } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { RichTextEditor } from "@/components/rich-text-editor"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { useAppStore, type Conversation } from "@/lib/store"

export default function NotePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const id = React.use(params).id

  const { notes, updateNote, addConversation, isSubscribed } = useAppStore()

  const note = notes.find((note) => note.id === id)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null)

  // 更新笔记内容
  useEffect(() => {
    const currentNote = notes.find((note) => note.id === id)
    if (currentNote) {
      setTitle(currentNote.title)
      setContent(currentNote.content)
      setLastSaved(new Date(currentNote.updatedAt))
    }
  }, [id, notes]) // 确保依赖项包含 id，这样当 id 变化时会重新执行

  // 自动保存
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer)
    }

    const timer = setTimeout(() => {
      if (title && content) {
        handleSave(true)
      }
    }, 30000) // 30秒自动保存

    setAutoSaveTimer(timer)

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer)
      }
    }
  }, [title, content, id]) // 添加 id 作为依赖项

  const handleSave = async (isAutoSave = false) => {
    if (!title) {
      toast({
        title: "请输入标题",
        description: "笔记标题不能为空",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    // 保存笔记，确保使用当前的 id
    updateNote(id, {
      title,
      content,
      updatedAt: new Date().toISOString(),
    })

    setLastSaved(new Date())
    setIsSaving(false)

    if (!isAutoSave) {
      toast({
        title: "保存成功",
        description: "您的笔记已成功保存",
      })
    }
  }

  const handleStartAIChat = () => {
    // 创建新对话
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: title.length > 20 ? `${title.substring(0, 20)}...` : title,
      noteIds: [id],
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: `我已加载笔记《${title}》，您可以向我提问关于这个笔记的内容。`,
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addConversation(newConversation)
    router.push(`/dashboard/ai/${newConversation.id}`)
  }

  const formatLastSaved = () => {
    if (!lastSaved) return ""

    const now = new Date()
    const diff = now.getTime() - lastSaved.getTime()

    if (diff < 60000) {
      return "刚刚保存"
    } else if (diff < 3600000) {
      return `${Math.floor(diff / 60000)} 分钟前保存`
    } else if (diff < 86400000) {
      return `${Math.floor(diff / 3600000)} 小时前保存`
    } else {
      return `${Math.floor(diff / 86400000)} 天前保存`
    }
  }

  return (
    <DashboardShell>
      <div className="flex h-full">
        <SidebarNavigation currentItemId={id} />

        <div className="flex-1 min-w-0 overflow-auto">
          <DashboardHeader
            heading={
              <div className="flex w-full items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
                  <ArrowLeft className="h-4 w-4" />
                  <span className="sr-only">返回</span>
                </Button>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-auto text-xl font-bold border-none shadow-none focus-visible:ring-0 p-0"
                  placeholder="笔记标题"
                />
              </div>
            }
            text={formatLastSaved()}
          >
            <div className="flex items-center gap-2">
              <Button onClick={handleStartAIChat} variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI对话
              </Button>
              <Button onClick={() => handleSave()} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "保存中..." : "保存"}
              </Button>
            </div>
          </DashboardHeader>

          <div className="p-4">
            <RichTextEditor value={content} onChange={setContent} className="min-h-[calc(100vh-200px)] w-full" />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
