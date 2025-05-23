"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type Note = {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export type Conversation = {
  id: string
  title: string
  noteIds: string[]
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AppState {
  notes: Note[]
  conversations: Conversation[]
  isSubscribed: boolean
  usageStats: {
    notesCount: number
    notesLimit: number
    queryCount: number
    queryLimit: number
  }

  // Notes actions
  addNote: (note: Note) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void

  // Conversation actions
  addConversation: (conversation: Conversation) => void
  updateConversation: (id: string, updates: Partial<Conversation>) => void
  deleteConversation: (id: string) => void
  addMessageToConversation: (conversationId: string, message: Message) => void

  // Usage actions
  incrementQueryCount: () => void
  setSubscriptionStatus: (status: boolean) => void
}

// Initial sample data
const initialNotes: Note[] = [
  {
    id: "1",
    title: "机器学习基础",
    content:
      "<h1>机器学习基础</h1><p>机器学习是人工智能的一个分支，主要研究计算机怎样模拟或实现人类的学习行为，以获取新的知识或技能，重新组织已有的知识结构使之不断改善自身的性能。</p><p>它是人工智能的核心，是使计算机具有智能的根本途径，也是实现计算机智能化的一个阶段。</p><h2>机器学习的主要方法</h2><ul><li>监督学习：从标记的训练数据中学习</li><li>无监督学习：从未标记的数据中发现模式</li><li>强化学习：通过与环境交互学习最优策略</li></ul><p>常见的机器学习算法包括线性回归、逻辑回归、决策树、随机森林、支持向量机、神经网络等。</p>",
    createdAt: "2025-05-10T10:30:00Z",
    updatedAt: "2025-05-15T14:20:00Z",
  },
  {
    id: "2",
    title: "深度学习框架比较",
    content:
      "<h1>深度学习框架比较</h1><p>本文比较了TensorFlow、PyTorch和JAX等主流深度学习框架的优缺点。</p><h2>TensorFlow</h2><p>优点：</p><ul><li>生产环境部署成熟</li><li>TensorFlow Lite支持移动设备</li><li>完善的可视化工具TensorBoard</li></ul><p>缺点：</p><ul><li>API变化较大</li><li>调试相对困难</li></ul><h2>PyTorch</h2><p>优点：</p><ul><li>动态计算图，调试方便</li><li>Python风格API，学习曲线平缓</li><li>研究领域应用广泛</li></ul><p>缺点：</p><ul><li>移动端支持不如TensorFlow</li><li>生产环境部署相对复杂</li></ul><h2>JAX</h2><p>优点：</p><ul><li>函数式编程风格</li><li>优秀的自动微分能力</li><li>与NumPy兼容性好</li></ul><p>缺点：</p><ul><li>生态系统相对不成熟</li><li>学习曲线较陡峭</li></ul>",
    createdAt: "2025-05-08T09:15:00Z",
    updatedAt: "2025-05-14T11:45:00Z",
  },
  {
    id: "3",
    title: "自然语言处理入门",
    content:
      "<h1>自然语言处理入门</h1><p>自然语言处理(NLP)是计算机科学、人工智能和语言学的交叉学科，致力于让计算机理解、解释和生成人类语言。</p><h2>NLP的主要任务</h2><ol><li>文本分类：将文本分为预定义的类别</li><li>命名实体识别：识别文本中的实体（人名、地名等）</li><li>情感分析：判断文本的情感倾向</li><li>机器翻译：在不同语言间转换文本</li><li>问答系统：回答用户的自然语言问题</li><li>文本摘要：生成文本的简短摘要</li><li>对话系统：与用户进行自然语言对话</li></ol><h2>NLP的发展历程</h2><ol><li>基于规则的方法（1950s-1980s）</li><li>统计方法（1990s-2010s）</li><li>深度学习方法（2010s-至今）</li><li>大型语言模型（2018-至今）</li></ol><h2>常用NLP库</h2><ul><li>NLTK：自然语言处理工具包</li><li>spaCy：工业级NLP库</li><li>Transformers：提供预训练模型</li><li>Stanza：斯坦福NLP工具</li></ul>",
    createdAt: "2025-05-05T16:20:00Z",
    updatedAt: "2025-05-12T08:30:00Z",
  },
]

const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    title: "关于机器学习的对话",
    noteIds: ["1"],
    messages: [
      {
        id: "msg-1",
        role: "assistant",
        content: "我已加载笔记《机器学习基础》，您可以向我提问关于这个笔记的内容。",
        timestamp: "2025-05-15T14:30:00Z",
      },
      {
        id: "msg-2",
        role: "user",
        content: "机器学习的主要方法有哪些？",
        timestamp: "2025-05-15T14:31:00Z",
      },
      {
        id: "msg-3",
        role: "assistant",
        content:
          "根据笔记《机器学习基础》中的内容，机器学习的主要方法包括：\n\n1. 监督学习：从标记的训练数据中学习\n2. 无监督学习：从未标记的数据中发现模式\n3. 强化学习：通过与环境交互学习最优策略",
        timestamp: "2025-05-15T14:31:30Z",
      },
    ],
    createdAt: "2025-05-15T14:30:00Z",
    updatedAt: "2025-05-15T14:31:30Z",
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      notes: initialNotes,
      conversations: initialConversations,
      isSubscribed: false,
      usageStats: {
        notesCount: initialNotes.length,
        notesLimit: 10,
        queryCount: 0,
        queryLimit: 5,
      },

      // Notes actions
      addNote: (note) =>
        set((state) => ({
          notes: [note, ...state.notes],
          usageStats: {
            ...state.usageStats,
            notesCount: state.isSubscribed ? state.usageStats.notesCount : state.notes.length + 1,
          },
        })),

      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates, updatedAt: new Date().toISOString() } : note,
          ),
        })),

      deleteNote: (id) =>
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          usageStats: {
            ...state.usageStats,
            notesCount: state.isSubscribed ? state.usageStats.notesCount : state.notes.length - 1,
          },
        })),

      // Conversation actions
      addConversation: (conversation) =>
        set((state) => ({
          conversations: [conversation, ...state.conversations],
        })),

      updateConversation: (id, updates) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id ? { ...conv, ...updates, updatedAt: new Date().toISOString() } : conv,
          ),
        })),

      deleteConversation: (id) =>
        set((state) => ({
          conversations: state.conversations.filter((conv) => conv.id !== id),
        })),

      addMessageToConversation: (conversationId, message) =>
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: [...conv.messages, message],
                  updatedAt: new Date().toISOString(),
                  title:
                    conv.title === "新对话" && message.role === "user"
                      ? message.content.length > 20
                        ? `${message.content.substring(0, 20)}...`
                        : message.content
                      : conv.title,
                }
              : conv,
          ),
        })),

      // Usage actions
      incrementQueryCount: () =>
        set((state) => ({
          usageStats: {
            ...state.usageStats,
            queryCount: state.usageStats.queryCount + 1,
          },
        })),

      setSubscriptionStatus: (status) =>
        set(() => ({
          isSubscribed: status,
        })),
    }),
    {
      name: "notella-storage",
    },
  ),
)
