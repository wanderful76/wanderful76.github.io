import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, PlayCircle, RotateCcw, X } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import { loveQuotes } from '../data/quotes'
import type { TaskCategory, TaskRepeat } from '../types'

const categoryConfig: Record<TaskCategory, { label: string; emoji: string; color: string }> = {
  study:    { label: '学习', emoji: '📚', color: 'bg-blue-100 text-blue-600' },
  exercise: { label: '运动', emoji: '💪', color: 'bg-green-100 text-green-600' },
  chore:    { label: '家务', emoji: '🏠', color: 'bg-amber-100 text-amber-600' },
  other:    { label: '其他', emoji: '✨', color: 'bg-purple-100 text-purple-600' },
}
const repeatConfig: Record<TaskRepeat, string> = {
  daily: '每日', weekly: '每周', once: '单次',
}

const defaultForm = {
  title: '', description: '', points: 2,
  repeat: 'daily' as TaskRepeat, category: 'study' as TaskCategory,
  deadline: '',
}

export default function TasksPage() {
  const { currentUser, users, addTickets, addPoints, updateStreak, incrementTasksCompleted } = useAuthStore()
  const { tasks, addTask, deleteTask, completeTask, setInProgress } = useTaskStore()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(defaultForm)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [toast, setToast] = useState<{ msg: string; emoji: string } | null>(null)

  const showToast = (msg: string, emoji: string) => {
    setToast({ msg, emoji })
    setTimeout(() => setToast(null), 2500)
  }

  const handleComplete = (id: string) => {
    if (!currentUser) return
    const task = completeTask(id, currentUser.id)
    if (task) {
      addTickets(currentUser.id, 1)
      addPoints(currentUser.id, task.points * 10)
      updateStreak(currentUser.id)
      incrementTasksCompleted(currentUser.id)
      showToast('获得 1 张抽奖券！', '🎟️')
    }
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !currentUser) return
    addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      points: form.points,
      repeat: form.repeat,
      category: form.category,
      deadline: form.deadline || undefined,
      createdBy: currentUser.id,
    })
    setForm(defaultForm)
    setShowForm(false)
    showToast('任务已添加！', '✅')
  }

  const filtered = tasks.filter(t =>
    filter === 'all' ? true :
    filter === 'pending' ? t.status !== 'completed' :
    t.status === 'completed'
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          任务列表
          <LoveQuoteSpot quote={loveQuotes[6]} icon="✨" />
        </h1>
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <Plus size={16} /> 添加任务
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 bg-white/60 p-1 rounded-xl">
        {(['all', 'pending', 'completed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              filter === f
                ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {f === 'all' ? '全部' : f === 'pending' ? '进行中' : '已完成'}
          </button>
        ))}
      </div>

      {/* Task list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="glass-card p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">🌸</p>
              <p className="text-sm">暂无任务</p>
            </motion.div>
          )}
          {filtered.map(task => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`glass-card p-4 ${task.status === 'completed' ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`badge ${categoryConfig[task.category].color}`}>
                      {categoryConfig[task.category].emoji} {categoryConfig[task.category].label}
                    </span>
                    <span className="badge bg-gray-100 text-gray-500">{repeatConfig[task.repeat]}</span>
                    <span className="badge bg-amber-50 text-amber-500">🎟 +1</span>
                  </div>
                  <p className={`font-medium text-gray-800 mt-1.5 ${task.status === 'completed' ? 'line-through' : ''}`}>
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{task.description}</p>
                  )}
                  {task.deadline && (
                    <p className="text-xs text-rose-400 mt-1">⏰ {task.deadline}</p>
                  )}
                  {task.status === 'completed' && task.completedAt && (
                    <p className="text-xs text-green-500 mt-1">
                      ✅ {users.find(u => u.id === task.completedBy)?.name ?? '未知'} 完成于 {new Date(task.completedAt).toLocaleString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {task.status === 'pending' && (
                    <>
                      <button onClick={() => setInProgress(task.id)}
                        className="p-1.5 rounded-lg text-amber-400 hover:bg-amber-50 transition-colors" title="开始">
                        <PlayCircle size={18} />
                      </button>
                      <button onClick={() => handleComplete(task.id)}
                        className="p-1.5 rounded-lg text-green-400 hover:bg-green-50 transition-colors" title="完成">
                        <CheckCircle2 size={18} />
                      </button>
                    </>
                  )}
                  {task.status === 'in_progress' && (
                    <button onClick={() => handleComplete(task.id)}
                      className="p-1.5 rounded-lg text-green-400 hover:bg-green-50 transition-colors" title="完成">
                      <CheckCircle2 size={18} />
                    </button>
                  )}
                  <button onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-red-300 hover:bg-red-50 hover:text-red-400 transition-colors" title="删除">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Add task modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
            onClick={e => e.target === e.currentTarget && setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              className="glass-card w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  添加新任务
                  <LoveQuoteSpot quote={loveQuotes[9]} icon="🌸" />
                </h2>
                <button onClick={() => setShowForm(false)} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">任务名称 *</label>
                  <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="例如：背 20 个单词" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">任务描述</label>
                  <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="可选说明" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">类别</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))}
                      className="input-field">
                      {(Object.keys(categoryConfig) as TaskCategory[]).map(c => (
                        <option key={c} value={c}>{categoryConfig[c].emoji} {categoryConfig[c].label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">重复</label>
                    <select value={form.repeat} onChange={e => setForm(f => ({ ...f, repeat: e.target.value as TaskRepeat }))}
                      className="input-field">
                      <option value="daily">每日</option>
                      <option value="weekly">每周</option>
                      <option value="once">单次</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">截止日期</label>
                  <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                    className="input-field" />
                </div>
                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-secondary flex-1">取消</button>
                  <button type="submit" className="btn-primary flex-1">添加任务</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 text-sm font-medium"
          >
            <span className="text-lg">{toast.emoji}</span> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unused import suppression */}
      <span className="hidden"><RotateCcw size={1} /></span>
    </div>
  )
}
