"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { FileText, Plus, Search, X } from "lucide-react"

interface Note {
  id: string
  title: string
}

interface NoteSidebarProps {
  notes: Note[]
  currentNoteId?: string
  onCreateNote: () => void
}

export function NoteSidebar({ notes, currentNoteId, onCreateNote }: NoteSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isCollapsed) {
    return (
      <div className="w-12 border-r h-full flex flex-col items-center py-4 bg-gray-50">
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="mb-4">
          <FileText className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCreateNote}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="w-64 border-r h-full flex flex-col bg-gray-50">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="font-medium">我的笔记</h3>
        <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="h-8 w-8">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索笔记..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {filteredNotes.map((note) => (
            <Link
              key={note.id}
              href={`/dashboard/notes/${note.id}`}
              className={`block px-3 py-2 rounded-md text-sm ${
                note.id === currentNoteId ? "bg-primary text-primary-foreground" : "hover:bg-gray-200"
              }`}
            >
              {note.title}
            </Link>
          ))}
          {filteredNotes.length === 0 && (
            <div className="px-3 py-6 text-center text-muted-foreground text-sm">
              {searchQuery ? "没有找到匹配的笔记" : "没有笔记"}
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-2 border-t">
        <Button onClick={onCreateNote} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          新建笔记
        </Button>
      </div>
    </div>
  )
}
