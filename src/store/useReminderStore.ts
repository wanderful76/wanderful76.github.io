import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Reminder } from '../types'

interface ReminderStore {
  reminders: Reminder[]
  addReminder: (data: Omit<Reminder, 'id' | 'createdAt'>) => void
  updateReminder: (id: string, data: Partial<Reminder>) => void
  deleteReminder: (id: string) => void
  clearAll: () => void
}

export const useReminderStore = create<ReminderStore>()(
  persist(
    (set) => ({
      reminders: [],

      addReminder: (data) => {
        const reminder: Reminder = {
          ...data,
          id: `rem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          createdAt: new Date().toISOString(),
        }
        set(state => ({
          reminders: [...state.reminders, reminder].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          ),
        }))
      },

      updateReminder: (id, data) => {
        set(state => ({
          reminders: state.reminders
            .map(r => r.id === id ? { ...r, ...data } : r)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
        }))
      },

      deleteReminder: (id) => {
        set(state => ({ reminders: state.reminders.filter(r => r.id !== id) }))
      },

      clearAll: () => set({ reminders: [] }),
    }),
    { name: 'forus-reminders-local' }
  )
)
