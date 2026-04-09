import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Task, TaskStatus, TaskCategory, TaskRepeat } from '../types'

interface TaskStore {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  completeTask: (id: string, userId: string) => Task | null
  setInProgress: (id: string) => void
  resetDailyTasks: () => void
  getTasksByUser: (userId: string) => Task[]
  getTodayTasks: () => Task[]
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      tasks: [
        {
          id: 'demo-1',
          title: '背 20 个单词',
          description: '每天坚持背单词，积累词汇量',
          points: 3,
          repeat: 'daily' as TaskRepeat,
          status: 'pending' as TaskStatus,
          category: 'study' as TaskCategory,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-2',
          title: '运动 30 分钟',
          description: '跑步、跳绳或其他有氧运动',
          points: 4,
          repeat: 'daily' as TaskRepeat,
          status: 'pending' as TaskStatus,
          category: 'exercise' as TaskCategory,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'demo-3',
          title: '整理学习笔记',
          description: '复习并整理今天学习的内容',
          points: 2,
          repeat: 'daily' as TaskRepeat,
          status: 'pending' as TaskStatus,
          category: 'study' as TaskCategory,
          createdBy: 'admin',
          createdAt: new Date().toISOString(),
        },
      ],

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
    }),
    { name: 'forus-tasks', version: 1 }
  )
)
