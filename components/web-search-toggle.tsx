"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface WebSearchToggleProps {
  isSubscribed: boolean
}

export function WebSearchToggle({ isSubscribed }: WebSearchToggleProps) {
  const router = useRouter()
  const [enabled, setEnabled] = useState(false)

  const handleToggle = (checked: boolean) => {
    if (checked && !isSubscribed) {
      toast({
        title: "需要升级",
        description: "联网搜索功能仅对付费用户开放，请升级您的账户",
      })
      router.push("/pricing")
      return
    }

    setEnabled(checked)
    toast({
      title: checked ? "联网搜索已开启" : "联网搜索已关闭",
      description: checked ? "AI将能够搜索并引用外部链接内容" : "AI将仅使用您的笔记内容",
    })
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="web-search" className="text-sm">
        联网搜索
      </Label>
      <Switch id="web-search" checked={enabled} onCheckedChange={handleToggle} />
    </div>
  )
}
