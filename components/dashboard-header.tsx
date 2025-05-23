"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

interface DashboardHeaderProps {
  heading: React.ReactNode
  text?: string
  children?: React.ReactNode
  isSubscribed?: boolean
  onUpgrade?: () => void
}

export function DashboardHeader({ heading, text, children, isSubscribed = false, onUpgrade }: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-tight">{heading}</h1>
        {text && <p className="text-muted-foreground">{text}</p>}
      </div>
      <div className="flex items-center gap-2">
        {!isSubscribed && onUpgrade && (
          <Button variant="outline" onClick={onUpgrade} className="gap-1">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>升级</span>
          </Button>
        )}
        {children}
      </div>
    </div>
  )
}
