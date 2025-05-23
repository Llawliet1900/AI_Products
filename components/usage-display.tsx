import { Progress } from "@/components/ui/progress"
import { Sparkles } from "lucide-react"

interface UsageDisplayProps {
  title: string
  current: number
  limit: number
  isUnlimited?: boolean
  type: "notes" | "loads" | "queries"
}

export function UsageDisplay({ title, current, limit, isUnlimited = false, type }: UsageDisplayProps) {
  const percentage = isUnlimited ? 0 : Math.min((current / limit) * 100, 100)

  const getTypeText = () => {
    switch (type) {
      case "notes":
        return "笔记"
      case "loads":
        return "加载"
      case "queries":
        return "AI对话"
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{title}</h4>
        <div className="flex items-center text-sm">
          {isUnlimited ? (
            <div className="flex items-center text-primary">
              <Sparkles className="mr-1 h-3 w-3" />
              <span>无限制</span>
            </div>
          ) : (
            <span>
              {current} / {limit} {getTypeText()}
            </span>
          )}
        </div>
      </div>
      {!isUnlimited && (
        <Progress
          value={percentage}
          className="h-2"
          indicatorClassName={
            isUnlimited
              ? "bg-gradient-to-r from-primary/80 to-primary"
              : percentage > 80
                ? "bg-red-500"
                : percentage > 60
                  ? "bg-yellow-500"
                  : ""
          }
        />
      )}
    </div>
  )
}
