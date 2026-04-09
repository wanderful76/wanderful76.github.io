export type TaskStatus = 'pending' | 'in_progress' | 'completed'
export type TaskRepeat = 'daily' | 'weekly' | 'once'
export type TaskCategory = 'study' | 'exercise' | 'chore' | 'other'

export interface Task {
  id: string
  title: string
  description: string
  points: number
  deadline?: string
  repeat: TaskRepeat
  status: TaskStatus
  category: TaskCategory
  createdBy: string
  completedBy?: string
  completedAt?: string
  createdAt: string
}

export type PrizeCategory = 'snack' | 'fruit' | 'cash' | 'privilege' | 'romantic'

export interface Prize {
  id: number
  name: string
  category: PrizeCategory
  emoji: string
  description?: string
}

export interface LotteryRecord {
  id: string
  prizeId: number
  prizeName: string
  prizeEmoji: string
  prizeCategory: PrizeCategory
  date: string
  userId: string
  userName: string
  claimed: boolean
}

export interface User {
  id: string
  name: string
  role: 'user'
  pin: string
  avatar: string
  points: number
  tickets: number
  streak: number
  lastCheckIn?: string
  totalTasksCompleted: number
  lastSeenPartnerDrawAt?: string
  joinedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  emoji: string
  condition: (stats: UserStats) => boolean
  unlockedAt?: string
}

export interface UserStats {
  totalTasksCompleted: number
  totalTicketsEarned: number
  totalPrizesWon: number
  currentStreak: number
  maxStreak: number
  prizesByCategory: Record<PrizeCategory, number>
  completionByDay: Record<string, number>
}
