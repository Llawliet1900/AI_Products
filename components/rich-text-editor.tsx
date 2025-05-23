"use client"

import { useState, useRef, useEffect } from "react"
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading1,
  Heading2,
  Heading3,
  Indent,
  Outdent,
  LinkIcon,
  ImageIcon,
  Code,
  Type,
  Palette,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "开始编写您的笔记...",
  className = "",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current) {
      // 只有当编辑器内容与传入的值不同时才更新
      // 这可以防止在编辑时光标位置重置
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ""
      }
    }
  }, [value])

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  // Editor commands
  const execCommand = (command: string, value = "") => {
    document.execCommand(command, false, value)
    handleInput()
    editorRef.current?.focus()
  }

  // Special handling for list commands
  const handleListCommand = (command: string) => {
    // Make sure we have focus
    editorRef.current?.focus()

    // Execute the command
    document.execCommand(command, false)

    // Update content
    handleInput()
  }

  const fontSizes = ["小", "正常", "大", "较大", "最大"]
  const fontFamilies = ["默认", "宋体", "黑体", "Arial", "Times New Roman", "Courier New"]
  const colors = [
    { name: "黑色", value: "#000000" },
    { name: "深灰", value: "#4b5563" },
    { name: "红色", value: "#ef4444" },
    { name: "橙色", value: "#f97316" },
    { name: "黄色", value: "#eab308" },
    { name: "绿色", value: "#22c55e" },
    { name: "蓝色", value: "#3b82f6" },
    { name: "紫色", value: "#8b5cf6" },
    { name: "粉色", value: "#ec4899" },
  ]

  return (
    <div className={`flex flex-col border rounded-md ${className}`}>
      <div className="flex flex-wrap items-center gap-0.5 p-1 border-b bg-muted/50">
        <TooltipProvider delayDuration={300}>
          {/* Font Family */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Type className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>字体</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              {fontFamilies.map((font) => (
                <DropdownMenuItem key={font} onClick={() => execCommand("fontName", font === "默认" ? "" : font)}>
                  {font}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Font Size */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <span className="text-sm font-bold">A</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>字号</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              {fontSizes.map((size, index) => (
                <DropdownMenuItem key={size} onClick={() => execCommand("fontSize", String(index + 1))}>
                  {size}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Text Color */}
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Palette className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>文字颜色</TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              {colors.map((color) => (
                <DropdownMenuItem
                  key={color.value}
                  onClick={() => execCommand("foreColor", color.value)}
                  className="flex items-center gap-2"
                >
                  <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color.value }}></div>
                  {color.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Bold */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("bold")}>
                <Bold className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>粗体</TooltipContent>
          </Tooltip>

          {/* Italic */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("italic")}>
                <Italic className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>斜体</TooltipContent>
          </Tooltip>

          {/* Underline */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("underline")}>
                <Underline className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>下划线</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Align Left */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyLeft")}>
                <AlignLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>左对齐</TooltipContent>
          </Tooltip>

          {/* Align Center */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyCenter")}>
                <AlignCenter className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>居中</TooltipContent>
          </Tooltip>

          {/* Align Right */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("justifyRight")}>
                <AlignRight className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>右对齐</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Heading 1 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => execCommand("formatBlock", "<h1>")}
              >
                <Heading1 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>标题1</TooltipContent>
          </Tooltip>

          {/* Heading 2 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => execCommand("formatBlock", "<h2>")}
              >
                <Heading2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>标题2</TooltipContent>
          </Tooltip>

          {/* Heading 3 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => execCommand("formatBlock", "<h3>")}
              >
                <Heading3 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>标题3</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Bullet List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleListCommand("insertUnorderedList")}
                type="button"
              >
                <List className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>无序列表</TooltipContent>
          </Tooltip>

          {/* Numbered List */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleListCommand("insertOrderedList")}
                type="button"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>有序列表</TooltipContent>
          </Tooltip>

          {/* Indent */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("indent")}>
                <Indent className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>增加缩进</TooltipContent>
          </Tooltip>

          {/* Outdent */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => execCommand("outdent")}>
                <Outdent className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>减少缩进</TooltipContent>
          </Tooltip>

          <Separator orientation="vertical" className="mx-1 h-6" />

          {/* Link */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const url = prompt("输入链接地址:", "https://")
                  if (url) execCommand("createLink", url)
                }}
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入链接</TooltipContent>
          </Tooltip>

          {/* Image */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  const url = prompt("输入图片地址:", "https://")
                  if (url) execCommand("insertImage", url)
                }}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>插入图片</TooltipContent>
          </Tooltip>

          {/* Code */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => execCommand("formatBlock", "<pre>")}
              >
                <Code className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>代码块</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div
        ref={editorRef}
        className={`flex-1 p-4 outline-none min-h-[300px] overflow-auto ${
          !value && !isFocused ? "before:text-muted-foreground before:content-[attr(data-placeholder)]" : ""
        }`}
        contentEditable
        data-placeholder={placeholder}
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </div>
  )
}
