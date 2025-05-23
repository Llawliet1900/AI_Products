"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { NotellaLogo } from "@/components/notella-logo"
import { toast } from "@/components/ui/use-toast"

export default function Login() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const handleSendCode = async () => {
    if (!phone || phone.length !== 11) {
      toast({
        title: "错误",
        description: "请输入正确的手机号码",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // 模拟发送验证码
    setTimeout(() => {
      setLoading(false)
      setCountdown(60)

      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast({
        title: "验证码已发送",
        description: "请查看您的手机短信",
      })
    }, 1500)
  }

  const handleLogin = async () => {
    if (!phone || phone.length !== 11) {
      toast({
        title: "错误",
        description: "请输入正确的手机号码",
        variant: "destructive",
      })
      return
    }

    if (!code || code.length !== 6) {
      toast({
        title: "错误",
        description: "请输入6位验证码",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // 模拟登录过程
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "登录成功",
        description: "正在跳转到笔记页面",
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-8 py-16 lg:px-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <NotellaLogo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight">登录 Notella</h2>
        </div>

        <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="space-y-6">
            <div>
              <Label htmlFor="phone">手机号码</Label>
              <div className="mt-2">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="请输入手机号码"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="code">验证码</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={countdown > 0}
                  onClick={() => countdown === 0 && handleSendCode()}
                  className="h-auto p-0 text-sm"
                >
                  {countdown > 0 ? `${countdown}秒后重新发送` : "获取验证码"}
                </Button>
              </div>
              <div className="mt-2">
                <Input
                  id="code"
                  type="text"
                  placeholder="请输入验证码"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="block w-full rounded-lg border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-base sm:leading-6"
                  required
                />
              </div>
            </div>

            <Button
              type="button"
              onClick={handleLogin}
              disabled={loading || countdown > 0}
              className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2 text-base font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {loading ? "登录中..." : "登录"}
            </Button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            还没有账号？{" "}
            <Link href="/register" className="font-semibold leading-6 text-primary hover:underline">
              注册
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
