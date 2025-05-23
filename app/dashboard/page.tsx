"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, MoreVertical, Plus, Search, Trash } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { UsageDisplay } from "@/components/usage-display"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { useAppStore, type Note, type Conversation } from "@/lib/store"
import { toast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<"notes" | "conversations">("notes")

  const { notes, conversations, addNote, deleteNote, addConversation, deleteConversation, isSubscribed, usageStats } =
    useAppStore()

  // 过滤笔记和对话
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.messages.some((msg) => msg.content.toLowerCase().includes(searchQuery.toLowerCase())),
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

    addConversation(newConversation)
    router.push(`/dashboard/ai/${newConversation.id}`)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <DashboardShell>
      <div className="flex h-[calc(100vh-64px)]">
        <SidebarNavigation />

        <div className="flex-1 overflow-auto">
          <DashboardHeader
            heading="我的内容"
            text="管理您的笔记和AI对话"
            isSubscribed={isSubscribed}
            onUpgrade={() => router.push("/pricing")}
          >
            <div className="flex gap-2">
              <Button onClick={handleCreateConversation} variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                新建对话
              </Button>
              <Button onClick={handleCreateNote}>
                <Plus className="mr-2 h-4 w-4" />
                新建笔记
              </Button>
            </div>
          </DashboardHeader>

          <div className="p-4 grid gap-8">
            <Tabs
              defaultValue="notes"
              className="w-full"
              onValueChange={(value) => setActiveTab(value as "notes" | "conversations")}
            >
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="notes" className="flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    笔记
                  </TabsTrigger>
                  <TabsTrigger value="conversations" className="flex items-center">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    对话
                  </TabsTrigger>
                </TabsList>
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="搜索..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <TabsContent value="notes" className="mt-6">
                {!isSubscribed && (
                  <UsageDisplay
                    title="笔记使用情况"
                    current={notes.length}
                    limit={usageStats.notesLimit}
                    isUnlimited={isSubscribed}
                    type="notes"
                  />
                )}

                {filteredNotes.length > 0 ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNotes.map((note) => (
                      <Card key={note.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">打开菜单</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/notes/${note.id}`)}>
                                  编辑
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    // 创建新对话
                                    const newConversation: Conversation = {
                                      id: `conv-${Date.now()}`,
                                      title: note.title.length > 20 ? `${note.title.substring(0, 20)}...` : note.title,
                                      noteIds: [note.id],
                                      messages: [
                                        {
                                          id: `msg-${Date.now()}`,
                                          role: "assistant",
                                          content: `我已加载笔记《${note.title}》，您可以向我提问关于这个笔记的内容。`,
                                          timestamp: new Date().toISOString(),
                                        },
                                      ],
                                      createdAt: new Date().toISOString(),
                                      updatedAt: new Date().toISOString(),
                                    }

                                    addConversation(newConversation)
                                    router.push(`/dashboard/ai/${newConversation.id}`)
                                  }}
                                >
                                  AI对话
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => deleteNote(note.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardDescription className="line-clamp-1">
                            更新于 {formatDate(note.updatedAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div
                            className="line-clamp-3 text-sm text-gray-500"
                            dangerouslySetInnerHTML={{
                              __html: note.content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...",
                            }}
                          />
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/dashboard/notes/${note.id}`)}
                          >
                            查看详情
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <FileText className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">没有找到笔记</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {searchQuery ? "没有找到匹配的笔记，请尝试其他搜索词" : "开始创建您的第一条笔记吧"}
                    </p>
                    {!searchQuery && (
                      <Button className="mt-4" onClick={handleCreateNote}>
                        <Plus className="mr-2 h-4 w-4" />
                        新建笔记
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="conversations" className="mt-6">
                {!isSubscribed && (
                  <UsageDisplay
                    title="AI对话使用情况"
                    current={usageStats.queryCount}
                    limit={usageStats.queryLimit}
                    isUnlimited={isSubscribed}
                    type="queries"
                  />
                )}

                {filteredConversations.length > 0 ? (
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredConversations.map((conv) => (
                      <Card key={conv.id} className="overflow-hidden">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="line-clamp-1 text-lg">{conv.title}</CardTitle>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">打开菜单</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => router.push(`/dashboard/ai/${conv.id}`)}>
                                  继续对话
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600" onClick={() => deleteConversation(conv.id)}>
                                  <Trash className="mr-2 h-4 w-4" />
                                  删除
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <CardDescription className="line-clamp-1">
                            {conv.noteIds.length > 0 ? <>已加载 {conv.noteIds.length} 条笔记</> : <>未加载笔记</>}
                            {" · "}
                            {formatDate(conv.updatedAt)}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-2">
                            {conv.messages
                              .filter((msg) => msg.role === "user")
                              .slice(-2)
                              .map((msg, index) => (
                                <div key={index} className="text-sm text-gray-500">
                                  <span className="font-medium">问：</span>
                                  <span className="line-clamp-1">{msg.content}</span>
                                </div>
                              ))}
                            {conv.messages.filter((msg) => msg.role === "user").length === 0 && (
                              <div className="text-sm text-gray-500 italic">尚未开始对话</div>
                            )}
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full"
                            onClick={() => router.push(`/dashboard/ai/${conv.id}`)}
                          >
                            查看对话
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-semibold">没有找到对话</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      {searchQuery ? "没有找到匹配的对话，请尝试其他搜索词" : "开始创建您的第一个AI对话吧"}
                    </p>
                    {!searchQuery && (
                      <Button className="mt-4" onClick={handleCreateConversation}>
                        <Plus className="mr-2 h-4 w-4" />
                        新建对话
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
