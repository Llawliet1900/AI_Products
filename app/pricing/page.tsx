import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function Pricing() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Notella</span>
          </Link>
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
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">选择适合您的套餐</h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  无论您是偶尔使用还是每天都需要，我们都有适合您的套餐
                </p>
              </div>
            </div>
            <div className="grid gap-6 pt-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col rounded-lg border p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">免费版</h3>
                  <p className="text-gray-500">适合初次尝试的用户</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  ¥0
                  <span className="ml-1 text-base font-normal text-gray-500">/永久</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>最多保存10条笔记</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>每日3次加载笔记</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>每日5次AI提问</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>基础模型支持 (DeepSeek v2)</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/register">
                    <Button className="w-full" variant="outline">
                      免费注册
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex flex-col rounded-lg border border-primary bg-primary/5 p-6">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">付费版</h3>
                  <p className="text-gray-500">适合需要高级功能的用户</p>
                </div>
                <div className="mt-4 flex items-baseline text-3xl font-bold">
                  ¥14.99
                  <span className="ml-1 text-base font-normal text-gray-500">/月</span>
                </div>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>无限笔记存储</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>无限加载笔记次数</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>无限AI提问次数</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>高级模型支持 (GPT-4/Claude)</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>自动抓取外部链接内容</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                    <span>优先客户支持</span>
                  </li>
                </ul>
                <div className="mt-6">
                  <Link href="/register">
                    <Button className="w-full">开始14天免费试用</Button>
                  </Link>
                  <p className="mt-2 text-center text-xs text-gray-500">无需信用卡，试用期结束后可随时取消</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">常见问题</h2>
              </div>
              <div className="mx-auto mt-8 grid max-w-3xl gap-6 md:gap-8">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">如何升级到付费版？</h3>
                  <p className="text-gray-500">登录后，在个人设置中点击"升级账户"，选择付费计划并完成支付即可升级。</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">我可以随时取消订阅吗？</h3>
                  <p className="text-gray-500">
                    是的，您可以随时在账户设置中取消订阅。取消后，您的付费功能将持续到当前计费周期结束。
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">支持哪些支付方式？</h3>
                  <p className="text-gray-500">
                    我们支持微信支付和支付宝。所有支付信息均通过官方SDK处理，确保您的支付安全。
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">如果我有更多问题，如何联系客服？</h3>
                  <p className="text-gray-500">
                    您可以通过应用内的"帮助与支持"页面联系我们，或发送邮件至support@notella.com。
                  </p>
                </div>
              </div>
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
