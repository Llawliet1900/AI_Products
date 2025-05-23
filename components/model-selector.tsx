"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ModelSelectorProps {
  isSubscribed: boolean
}

export function ModelSelector({ isSubscribed }: ModelSelectorProps) {
  const router = useRouter()
  const [selectedModel, setSelectedModel] = useState("deepseek-v2")

  const models = [
    { id: "deepseek-v2", name: "DeepSeek v2", isPremium: false },
    { id: "gpt-4o", name: "GPT-4o", isPremium: true },
    { id: "claude-3-opus", name: "Claude 3 Opus", isPremium: true },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", isPremium: true },
    { id: "gemini-pro", name: "Gemini Pro", isPremium: true },
  ]

  const handleSelectModel = (modelId: string) => {
    const model = models.find((m) => m.id === modelId)

    if (model?.isPremium && !isSubscribed) {
      toast({
        title: "需要升级",
        description: "此模型仅对付费用户开放，请升级您的账户",
      })
      router.push("/pricing")
      return
    }

    setSelectedModel(modelId)
    toast({
      title: "模型已更改",
      description: `已切换到 ${model?.name}`,
    })
  }

  const currentModel = models.find((m) => m.id === selectedModel)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-1">
          {currentModel?.isPremium && <Sparkles className="h-3.5 w-3.5 text-yellow-500" />}
          {currentModel?.name}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {models.map((model) => (
          <DropdownMenuItem
            key={model.id}
            onClick={() => handleSelectModel(model.id)}
            className="flex items-center gap-1"
          >
            {model.isPremium && <Sparkles className="h-3.5 w-3.5 text-yellow-500" />}
            {model.name}
            {model.id === selectedModel && <span className="ml-auto text-primary">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
