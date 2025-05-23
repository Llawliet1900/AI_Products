import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, MessageSquare, ArrowRight } from "lucide-react"
import { NotellaLogo } from "@/components/notella-logo"
import { Brain } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <NotellaLogo />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">登录</Button>
            </Link>
            <Link href="/register">
              <Button>注册</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  智能笔记助手
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  通过AI增强的对话式交互，实现笔记内容与大型语言模型的深度结合
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/register">
                  <Button className="px-8">开始使用</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="outline">查看套餐</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">智能笔记管理</h3>
                  <p className="text-gray-500">创建、编辑和组织您的笔记，支持富文本编辑和自动保存</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">AI 对话交互</h3>
                  <p className="text-gray-500">与您的笔记进行对话，AI 助手会基于您的笔记内容回答问题</p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">知识连接</h3>
                  <p className="text-gray-500">自动分析笔记内容，建立知识连接，帮助您更好地理解和记忆</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">立即开始使用 Notella</h2>
                <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
                  免费用户可以创建最多10条笔记，每日3次加载笔记和5次AI提问
                </p>
              </div>
              <Link href="/register">
                <Button className="px-8">
                  免费注册
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-gray-500">&copy; 2025 Notella. 保留所有权利.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-gray-500 hover:underline">
              服务条款
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:underline">
              隐私政策
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
