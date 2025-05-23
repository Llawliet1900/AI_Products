"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface Note {
  id: string
  title: string
}

interface NoteSelectionModalProps {
  notes: Note[]
  selectedNoteIds: string[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (selectedIds: string[]) => void
}

export function NoteSelectionModal({ notes, selectedNoteIds, open, onOpenChange, onConfirm }: NoteSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selection, setSelection] = useState<string[]>(selectedNoteIds)

  const filteredNotes = notes.filter((note) => note.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSelectAll = () => {
    setSelection(filteredNotes.map((note) => note.id))
  }

  const handleDeselectAll = () => {
    setSelection([])
  }

  const handleToggleNote = (id: string) => {
    setSelection((prev) => (prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]))
  }

  const handleConfirm = () => {
    onConfirm(selection)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>选择笔记</DialogTitle>
          <DialogDescription>选择要加载到AI对话中的笔记，可以多选</DialogDescription>
        </DialogHeader>
        <div className="relative my-2">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索笔记..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">
            已选择 {selection.length} / {notes.length} 条笔记
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleSelectAll}>
              全部选择
            </Button>
            <Button variant="outline" size="sm" onClick={handleDeselectAll}>
              全部取消
            </Button>
          </div>
        </div>
        <ScrollArea className="max-h-[300px] pr-4">
          <div className="space-y-2">
            {filteredNotes.map((note) => (
              <div key={note.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`note-${note.id}`}
                  checked={selection.includes(note.id)}
                  onCheckedChange={() => handleToggleNote(note.id)}
                />
                <label
                  htmlFor={`note-${note.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {note.title}
                </label>
              </div>
            ))}
            {filteredNotes.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">没有找到匹配的笔记</div>
            )}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
