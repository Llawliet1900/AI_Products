import { BookOpen } from "lucide-react"

interface NotellaLogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
  className?: string
}

export function NotellaLogo({ size = "md", withText = true, className = "" }: NotellaLogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/50 rounded-md opacity-30 blur-[2px]"></div>
        <div className="relative bg-gradient-to-br from-primary/80 to-primary rounded-md p-1">
          <BookOpen className={`${sizeClasses[size]} text-white`} />
        </div>
      </div>
      {withText && <span className={`font-bold ${textSizeClasses[size]}`}>Notella</span>}
    </div>
  )
}
