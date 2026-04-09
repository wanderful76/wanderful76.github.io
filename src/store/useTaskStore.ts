import { create } from 'zustand'
import type { Task, TaskStatus, TaskCategory, TaskRepeat } from '../types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string, userId: string) => Task | null
  setInProgress: (id: string) => void
  resetDailyTasks: () => void
  resetAllTasks: () => void
  getTasksByUser: (userId: string) => Task[]
  getTodayTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>()(
  (set, get) => ({
      tasks: [],

      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
        }
        set(state => ({ tasks: [...state.tasks, task] }))
      },

      updateTask: (id, updates) => {
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t),
        }))
      },

      deleteTask: (id) => {
        set(state => ({ tasks: state.tasks.filter(t => t.id !== id) }))
      },

      completeTask: (id, userId) => {
        const task = get().tasks.find(t => t.id === id)
        if (!task || task.status === 'completed') return null
        const updated: Task = {
          ...task,
          status: 'completed',
          completedBy: userId,
          completedAt: new Date().toISOString(),
        }
        set(state => ({
          tasks: state.tasks.map(t => t.id === id ? updated : t),
        }))
        return updated
      },

      setInProgress: (id) => {
        set(state => ({
          tasks: state.tasks.map(t =>
            t.id === id && t.status === 'pending' ? { ...t, status: 'in_progress' } : t
          ),
        }))
      },

      resetAllTasks: () => set({ tasks: [] }),

      resetDailyTasks: () => {
        const today = new Date().toDateString()
        set(state => ({
          tasks: state.tasks.map(t => {
            if (t.repeat === 'daily' && t.status === 'completed') {
              const completedDay = t.completedAt
                ? new Date(t.completedAt).toDateString()
                : null
              if (completedDay !== today) {
                return { ...t, status: 'pending', completedBy: undefined, completedAt: undefined }
              }
            }
            return t
          }),
        }))
      },

      getTasksByUser: (userId) => {
        return get().tasks.filter(t => t.createdBy === userId || t.completedBy === userId)
      },

      getTodayTasks: () => {
        const today = new Date().toDateString()
        return get().tasks.filter(t => {
          if (t.repeat === 'daily') return true
          if (t.repeat === 'weekly') return true
          if (t.repeat === 'once') {
            if (t.status === 'completed') {
              return t.completedAt
                ? new Date(t.completedAt).toDateString() === today
                : false
            }
            return true
          }
          return true
        })
      },
  })
)
