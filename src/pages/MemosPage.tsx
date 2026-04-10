import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, CheckCircle2, X, Bell, Star } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useWishStore } from '../store/useWishStore'
import { useReminderStore } from '../store/useReminderStore'
import type { WishCategory } from '../types'

const wishCategoryConfig: Record<WishCategory, { label: string; emoji: string; color: string }> = {
  travel:  { label: '旅行',  emoji: '✈️',  color: 'bg-sky-100 text-sky-600' },
  food:    { label: '美食',  emoji: '🍜',  color: 'bg-amber-100 text-amber-600' },
  gift:    { label: '礼物',  emoji: '🎁',  color: 'bg-rose-100 text-rose-600' },
  study:   { label: '学习',  emoji: '📚',  color: 'bg-violet-100 text-violet-600' },
  date:    { label: '约会',  emoji: '💕',  color: 'bg-pink-100 text-pink-600' },
  other:   { label: '其他',  emoji: '✨',  color: 'bg-gray-100 text-gray-600' },
}

const reminderEmojis = ['📅','📝','🎓','💊','🏃','✈️','🎂','💕','🎉','⏰','📌','🌟']

function getDaysLeft(dateStr: string, repeat: 'once' | 'yearly') {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  let target = new Date(dateStr + 'T00:00:00')
  if (repeat === 'yearly') {
    target.setFullYear(today.getFullYear())
    if (target < today) target.setFullYear(today.getFullYear() + 1)
  }
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000)
  return diff
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

export default function MemosPage() {
  const { currentUser, users } = useAuthStore()
  const { wishes, addWish, fulfillWish, deleteWish } = useWishStore()
  const { reminders, addReminder, deleteReminder } = useReminderStore()
  const [tab, setTab] = useState<'wishes' | 'reminders'>('wishes')

  // Wish form
  const [showWishForm, setShowWishForm] = useState(false)
  const [wishTitle, setWishTitle] = useState('')
  const [wishNote, setWishNote] = useState('')
  const [wishCat, setWishCat] = useState<WishCategory>('other')

  // Reminder form
  const [showRemForm, setShowRemForm] = useState(false)
  const [remTitle, setRemTitle] = useState('')
  const [remDate, setRemDate] = useState('')
  const [remNote, setRemNote] = useState('')
  const [remEmoji, setRemEmoji] = useState('📅')
  const [remRepeat, setRemRepeat] = useState<'once' | 'yearly'>('once')

  const [toast, setToast] = useState('')
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishTitle.trim() || !currentUser) return
    addWish(wishTitle.trim(), wishNote.trim(), wishCat, currentUser.id)
    setWishTitle(''); setWishNote(''); setWishCat('other'); setShowWishForm(false)
    showToast('愿望已添加 ⭐')
  }

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!remTitle.trim() || !remDate || !currentUser) return
    addReminder({ title: remTitle.trim(), date: remDate, note: remNote.trim() || undefined, emoji: remEmoji, createdBy: currentUser.id, repeat: remRepeat })
    setRemTitle(''); setRemDate(''); setRemNote(''); setRemEmoji('📅'); setRemRepeat('once'); setShowRemForm(false)
    showToast('提醒已添加 🔔')
  }

  const getUserName = (userId: string) => users.find(u => u.id === userId)?.name ?? userId

  const pendingWishes = wishes.filter(w => !w.fulfilled)
  const fulfilledWishes = wishes.filter(w => w.fulfilled)

  const sortedReminders = [...reminders].sort((a, b) => {
    const da = getDaysLeft(a.date, a.repeat)
    const db = getDaysLeft(b.date, b.repeat)
    return da - db
  })

  return (
    <div className="space-y-4 pb-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-700">
          {tab === 'wishes' ? '⭐ 愿望单' : '🔔 日期提醒'}
        </h1>
        <button
          onClick={() => tab === 'wishes' ? setShowWishForm(true) : setShowRemForm(true)}
          className="btn-primary px-3 py-1.5 text-sm flex items-center gap-1.5">
          <Plus size={15} /> 添加
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/60 p-1 rounded-xl">
        {(['wishes', 'reminders'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              tab === t
                ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'wishes' ? <><Star size={13} /> 愿望单</> : <><Bell size={13} /> 日期提醒</>}
          </button>
        ))}
      </div>

      {/* Wish Add Form */}
      <AnimatePresence>
        {tab === 'wishes' && showWishForm && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAddWish} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-700 text-sm">添加愿望</h3>
              <button type="button" onClick={() => setShowWishForm(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <input value={wishTitle} onChange={e => setWishTitle(e.target.value)}
              placeholder="许个愿望吧..." className="input-field" required />
            <input value={wishNote} onChange={e => setWishNote(e.target.value)}
              placeholder="备注（可选）" className="input-field" />
            <div className="flex flex-wrap gap-2">
              {(Object.entries(wishCategoryConfig) as [WishCategory, { label: string; emoji: string }][]).map(([k, v]) => (
                <button key={k} type="button" onClick={() => setWishCat(k)}
                  className={`px-3 py-1 rounded-full text-xs border transition-all ${wishCat === k ? 'border-rose-400 bg-rose-50 text-rose-600 font-semibold' : 'border-gray-200 text-gray-500'}`}>
                  {v.emoji} {v.label}
                </button>
              ))}
            </div>
            <button type="submit" className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 text-sm">
              <Plus size={14} /> 添加愿望
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Reminder Add Form */}
      <AnimatePresence>
        {tab === 'reminders' && showRemForm && (
          <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            onSubmit={handleAddReminder} className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-gray-700 text-sm">添加日期提醒</h3>
              <button type="button" onClick={() => setShowRemForm(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <input value={remTitle} onChange={e => setRemTitle(e.target.value)}
              placeholder="提醒名称（如：期末考试）" className="input-field" required />
            <div className="flex gap-2">
              <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)}
                className="input-field flex-1" required />
              <select value={remRepeat} onChange={e => setRemRepeat(e.target.value as 'once' | 'yearly')}
                className="input-field w-24 text-sm">
                <option value="once">单次</option>
                <option value="yearly">每年</option>
              </select>
            </div>
            <input value={remNote} onChange={e => setRemNote(e.target.value)}
              placeholder="备注（可选）" className="input-field" />
            <div>
              <p className="text-xs text-gray-500 mb-1.5">选择图标</p>
              <div className="flex flex-wrap gap-1.5">
                {reminderEmojis.map(e => (
                  <button key={e} type="button" onClick={() => setRemEmoji(e)}
                    className={`w-8 h-8 rounded-lg text-base flex items-center justify-center transition-all ${remEmoji === e ? 'bg-rose-100 border-2 border-rose-400 scale-110' : 'bg-gray-50 hover:bg-rose-50'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" className="btn-primary w-full py-2 flex items-center justify-center gap-1.5 text-sm">
              <Plus size={14} /> 添加提醒
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Wishes Tab */}
      {tab === 'wishes' && (
        <div className="space-y-3">
          {pendingWishes.length === 0 && fulfilledWishes.length === 0 && (
            <div className="glass-card p-10 flex flex-col items-center gap-2 text-center">
              <span className="text-4xl">⭐</span>
              <p className="text-gray-500 text-sm">还没有愿望，快来许下你们的心愿吧</p>
            </div>
          )}

          {pendingWishes.map(w => {
            const cat = wishCategoryConfig[w.category]
            return (
              <motion.div key={w.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 flex items-start gap-3">
                <span className="text-2xl mt-0.5">{cat.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{w.title}</p>
                  {w.note && <p className="text-sm text-gray-500 mt-0.5">{w.note}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${cat.color}`}>{cat.label}</span>
                    <span className="text-xs text-gray-400">{getUserName(w.addedBy)} 添加</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => { fulfillWish(w.id, currentUser!.id); showToast('愿望实现了！🎉') }}
                    className="p-1.5 rounded-lg text-green-400 hover:bg-green-50 transition-colors" title="标记实现">
                    <CheckCircle2 size={18} />
                  </button>
                  <button onClick={() => deleteWish(w.id)}
                    className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            )
          })}

          {fulfilledWishes.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-400 px-1 mb-2">✅ 已实现 ({fulfilledWishes.length})</p>
              <div className="space-y-2">
                {fulfilledWishes.map(w => {
                  const cat = wishCategoryConfig[w.category]
                  return (
                    <motion.div key={w.id} layout
                      className="glass-card p-3 flex items-center gap-3 opacity-60">
                      <span className="text-xl">{cat.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-500 line-through text-sm">{w.title}</p>
                        <p className="text-xs text-gray-400">{w.fulfilledBy ? getUserName(w.fulfilledBy) : ''} 实现了</p>
                      </div>
                      <button onClick={() => deleteWish(w.id)}
                        className="p-1.5 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reminders Tab */}
      {tab === 'reminders' && (
        <div className="space-y-3">
          {sortedReminders.length === 0 && (
            <div className="glass-card p-10 flex flex-col items-center gap-2 text-center">
              <span className="text-4xl">📅</span>
              <p className="text-gray-500 text-sm">还没有日期提醒，添加一个重要日子吧</p>
            </div>
          )}

          {sortedReminders.map(r => {
            const days = getDaysLeft(r.date, r.repeat)
            const isPast = days < 0
            const isToday = days === 0
            const isSoon = days > 0 && days <= 7
            return (
              <motion.div key={r.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`glass-card p-4 flex items-center gap-3 ${isToday ? 'border-2 border-rose-300 bg-rose-50/50' : isSoon ? 'border border-amber-200 bg-amber-50/30' : ''}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  isToday ? 'bg-rose-100' : isSoon ? 'bg-amber-100' : isPast ? 'bg-gray-100' : 'bg-sky-100'
                }`}>
                  {r.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800">{r.title}</p>
                  <p className="text-sm text-gray-500">{formatDate(r.date)}{r.repeat === 'yearly' ? ' · 每年' : ''}</p>
                  {r.note && <p className="text-xs text-gray-400 mt-0.5">{r.note}</p>}
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-sm font-bold ${
                    isToday ? 'text-rose-500' : isSoon ? 'text-amber-500' : isPast ? 'text-gray-400' : 'text-sky-600'
                  }`}>
                    {isToday ? '🔴 今天！' : isPast ? `${Math.abs(days)}天前` : `还有 ${days} 天`}
                  </span>
                  <button onClick={() => deleteReminder(r.id)}
                    className="p-1 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white px-5 py-3 rounded-2xl shadow-xl z-50 flex items-center gap-2 text-sm font-medium">
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
