import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

const defaultUsers: User[] = [
  {
    id: 'user1',
    name: '管理员',
    role: 'user',
    pin: '1234',
    avatar: '👑',
    points: 0,
    tickets: 0,
    streak: 0,
    totalTasksCompleted: 0,
    joinedAt: new Date().toISOString(),
  },
  {
    id: 'user2',
    name: '宝贝',
    role: 'user',
    pin: '5678',
    avatar: '🌸',
    points: 0,
    tickets: 0,
    streak: 0,
    totalTasksCompleted: 0,
    joinedAt: new Date().toISOString(),
  },
]

interface AuthStore {
  currentUser: User | null
  users: User[]
  login: (name: string, pin: string) => boolean
  logout: () => void
  addTickets: (userId: string, amount: number) => void
  useTickets: (userId: string, amount: number) => boolean
  addPoints: (userId: string, amount: number) => void
  updateStreak: (userId: string) => void
  incrementTasksCompleted: (userId: string) => void
  updatePin: (userId: string, newPin: string) => void
  updateName: (userId: string, newName: string) => void
  updateAvatar: (userId: string, newAvatar: string) => void
  getUser: (userId: string) => User | undefined
  markPartnerDrawSeen: (userId: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: defaultUsers,

      login: (name, pin) => {
        const user = get().users.find(
          u => u.name === name && u.pin === pin
        )
        if (user) {
          set({ currentUser: user })
          return true
        }
        return false
      },

      logout: () => set({ currentUser: null }),

      addTickets: (userId, amount) => {
        set(state => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, tickets: u.tickets + amount } : u
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, tickets: state.currentUser.tickets + amount }
            : state.currentUser,
        }))
      },

      useTickets: (userId, amount) => {
        const user = get().users.find(u => u.id === userId)
        if (!user || user.tickets < amount) return false
        set(state => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, tickets: u.tickets - amount } : u
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, tickets: state.currentUser.tickets - amount }
            : state.currentUser,
        }))
        return true
      },

      addPoints: (userId, amount) => {
        set(state => ({
          users: state.users.map(u =>
            u.id === userId ? { ...u, points: u.points + amount } : u
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, points: state.currentUser.points + amount }
            : state.currentUser,
        }))
      },

      updateStreak: (userId) => {
        const user = get().users.find(u => u.id === userId)
        if (!user) return
        const today = new Date().toDateString()
        const lastCheck = user.lastCheckIn ? new Date(user.lastCheckIn).toDateString() : null
        const yesterday = new Date(Date.now() - 86400000).toDateString()
        const newStreak = lastCheck === today
          ? user.streak
          : lastCheck === yesterday
            ? user.streak + 1
            : 1
        set(state => ({
          users: state.users.map(u =>
            u.id === userId
              ? { ...u, streak: newStreak, lastCheckIn: new Date().toISOString() }
              : u
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, streak: newStreak, lastCheckIn: new Date().toISOString() }
            : state.currentUser,
        }))
      },

      incrementTasksCompleted: (userId) => {
        set(state => ({
          users: state.users.map(u =>
            u.id === userId
              ? { ...u, totalTasksCompleted: u.totalTasksCompleted + 1 }
              : u
          ),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, totalTasksCompleted: state.currentUser.totalTasksCompleted + 1 }
            : state.currentUser,
        }))
      },

      updatePin: (userId, newPin) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, pin: newPin } : u),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, pin: newPin }
            : state.currentUser,
        }))
      },

      updateName: (userId, newName) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, name: newName } : u),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, name: newName }
            : state.currentUser,
        }))
      },

      updateAvatar: (userId, newAvatar) => {
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, avatar: newAvatar } : u),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, avatar: newAvatar }
            : state.currentUser,
        }))
      },

      getUser: (userId) => get().users.find(u => u.id === userId),

      markPartnerDrawSeen: (userId) => {
        const now = new Date().toISOString()
        set(state => ({
          users: state.users.map(u => u.id === userId ? { ...u, lastSeenPartnerDrawAt: now } : u),
          currentUser: state.currentUser?.id === userId
            ? { ...state.currentUser, lastSeenPartnerDrawAt: now }
            : state.currentUser,
        }))
      },
    }),
    { name: 'forus-auth', version: 1 }
  )
)
