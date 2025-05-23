"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  FileText,
  MessageSquare,
  Plus,
  Search,
  X,
  ChevronDown,
  ChevronRight,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react"
import { useAppStore, type Note, type Conversation } from "@/lib/store"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"

interface SidebarNavigationProps {
  currentItemId?: string
}

export function SidebarNavigation({ currentItemId }: SidebarNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isNotesExpanded, setIsNotesExpanded] = useState(true)
  const [isConversationsExpanded, setIsConversationsExpanded] = useState(true)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [itemToRename, setItemToRename] = useState<{ id: string; type: "note" | "conversation"; title: string } | null>(
    null,
  )
  const [newTitle, setNewTitle] = useState("")

  const {
    notes,
    conversations,
    addNote,
    deleteNote,
    updateNote,
    deleteConversation,
    updateConversation,
    isSubscribed,
    usageStats,
  } = useAppStore()

  const isInNotesSection = pathname.includes("/notes/")
  const isInConversationsSection = pathname.includes("/ai/")

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const filteredConversations = conversations.filter((conv) =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateNote = () => {
    if (!isSubscribed && notes.length >= usageStats.notesLimit) {
      toast({
        title: "笔记数量已达上限",
        description: "免费用户最多可创建10条笔记，请升级到付费版解锁更多功能",
        variant: "destructive",
      })
      return
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: "新笔记",
      content: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    addNote(newNote)
    router.push(`/dashboard/notes/${newNote.id}`)
  }

  const handleCreateConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: "新对话",
      noteIds: [],
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          content: "您好，我是Notella的AI助手。请选择要加载的笔记开始对话，或直接向我提问。",
          timestamp: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    useAppStore.getState().addConversation(newConversation)
    router.push(`/dashboard/ai/${newConversation.id}`)
  }

  const handleDeleteItem = (id: string, type: "note" | "conversation") => {
    if (type === "note") {
      deleteNote(id)
      if (id === currentItemId && isInNotesSection) {
        router.push("/dashboard")
      }
      toast({
        title: "笔记已删除",
        description: "您的笔记已成功删除",
      })
    } else {
      deleteConversation(id)
      if (id === currentItemId && isInConversationsSection) {
        router.push("/dashboard")
      }
      toast({
        title: "对话已删除",
        description: "您的对话已成功删除",
      })
    }
  }

  const openRenameDialog = (id: string, type: "note" | "conversation", title: string) => {
    setItemToRename({ id, type, title })
    setNewTitle(title)
    setIsRenameDialogOpen(true)
  }

  const handleRename = () => {
    if (!itemToRename) return

    if (newTitle.trim() === "") {
      toast({
        title: "标题不能为空",
        description: "请输入有效的标题",
        variant: "destructive",
      })
      return
    }

    if (itemToRename.type === "note") {
      updateNote(itemToRename.id, { title: newTitle })
      toast({
        title: "笔记已重命名",
        description: `笔记已重命名为"${newTitle}"`,
      })
    } else {
      updateConversation(itemToRename.id, { title: newTitle })
      toast({
        title: "对话已重命名",
        description: `对话已重命名为"${newTitle}"`,
      })
    }

    setIsRenameDialogOpen(false)
    setItemToRename(null)
  }

  if (isCollapsed) {
    return (
      <div className="w-12 border-r h-full flex flex-col items-center py-4 bg-gray-50">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="mb-4">
          <FileText className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleCreateNote}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">我的内容</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {/* 笔记部分 */}
          <div className="mb-2">
            <div
              className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-200 rounded-md"
              onClick={() => setIsNotesExpanded(!isNotesExpanded)}
            >
              <div className="flex items-center">
                {isNotesExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
                <span>笔记</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateNote()
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {isNotesExpanded && (
              <div className="mt-1 space-y-1">
                {filteredNotes.length > 0 ? (
                  filteredNotes.map((note) => (
                    <div key={note.id} className="group flex items-center justify-between">
                      <Link
                        href={`/dashboard/notes/${note.id}`}
                        className={`flex-1 block px-3 py-2 rounded-md text-sm ${
                          note.id === currentItemId ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{note.title}</span>
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${note.id === currentItemId ? "" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openRenameDialog(note.id, "note", note.title)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteItem(note.id, "note")}>
                            <Trash className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-center text-muted-foreground text-sm">
                    {searchQuery ? "没有找到匹配的笔记" : "没有笔记"}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 对话部分 */}
          <div>
            <div
              className="flex items-center justify-between px-2 py-1.5 text-sm font-medium cursor-pointer hover:bg-gray-200 rounded-md"
              onClick={() => setIsConversationsExpanded(!isConversationsExpanded)}
            >
              <div className="flex items-center">
                {isConversationsExpanded ? (
                  <ChevronDown className="h-4 w-4 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 mr-1" />
                )}
                <span>对话</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={(e) => {
                  e.stopPropagation()
                  handleCreateConversation()
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {isConversationsExpanded && (
              <div className="mt-1 space-y-1">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conv) => (
                    <div key={conv.id} className="group flex items-center justify-between">
                      <Link
                        href={`/dashboard/ai/${conv.id}`}
                        className={`flex-1 block px-3 py-2 rounded-md text-sm ${
                          conv.id === currentItemId ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="truncate">{conv.title}</span>
                        </div>
                      </Link>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${conv.id === currentItemId ? "" : "opacity-0 group-hover:opacity-100"}`}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openRenameDialog(conv.id, "conversation", conv.title)}>
                            <Pencil className="h-4 w-4 mr-2" />
                            重命名
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteItem(conv.id, "conversation")}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            删除
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="px-3 py-2 text-center text-muted-foreground text-sm">
                    {searchQuery ? "没有找到匹配的对话" : "没有对话"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
      <div className="p-2 border-t">
        <Button onClick={handleCreateNote} className="w-full mb-2">
          <Plus className="mr-2 h-4 w-4" />
          新建笔记
        </Button>
        <Button onClick={handleCreateConversation} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          新建对话
        </Button>
      </div>

      {/* 重命名对话框 */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>重命名{itemToRename?.type === "note" ? "笔记" : "对话"}</DialogTitle>
            <DialogDescription>请输入新的{itemToRename?.type === "note" ? "笔记" : "对话"}标题</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder={`请输入${itemToRename?.type === "note" ? "笔记" : "对话"}标题`}
              className="w-full"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename}>确认</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
