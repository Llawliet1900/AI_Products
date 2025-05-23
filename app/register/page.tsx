"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { NotellaLogo } from "@/components/notella-logo"
import { toast } from "@/components/ui/use-toast"

export default function Register() {
  const router = useRouter()
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState(1)
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
      setStep(2)
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

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) {
      toast({
        title: "错误",
        description: "请输入6位验证码",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    // 模拟验证过程
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "注册成功",
        description: "正在跳转到笔记页面",
      })
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <NotellaLogo size="lg" />
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight">注册 Notella</h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {step === 1 ? (
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
                    required
                  />
                </div>
              </div>

              <Button className="w-full" onClick={handleSendCode} disabled={loading}>
                {loading ? "发送中..." : "获取验证码"}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
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
                    {countdown > 0 ? `${countdown}秒后重新发送` : "重新发送"}
                  </Button>
                </div>
                <div className="mt-2">
                  <Input
                    id="code"
                    type="text"
                    placeholder="请输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">验证码已发送至 {phone}</p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  返回
                </Button>
                <Button className="flex-1" onClick={handleVerifyCode} disabled={loading}>
                  {loading ? "验证中..." : "验证并注册"}
                </Button>
              </div>
            </div>
          )}

          <p className="mt-10 text-center text-sm text-gray-500">
            已有账号？{" "}
            <Link href="/login" className="font-semibold leading-6 text-primary hover:underline">
              登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
