import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { prizes } from '../data/prizes'
import { prizeCategoryConfig } from '../data/prizes'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import { loveQuotes } from '../data/quotes'
import type { PrizeCategory } from '../types'

const avatarOptions = ['👑','🌸','🐼','🦊','🐰','🌙','⭐','🦋','🌺','🎀','🍀','🌈']

export default function SettingsPage() {
  const { currentUser, users, updatePin, updateName, updateAvatar } = useAuthStore()
  const { tasks, deleteTask } = useTaskStore()
  const { records } = useLotteryStore()

  const [newPin, setNewPin]         = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [newName, setNewName]       = useState(currentUser?.name ?? '')
  const [showPin, setShowPin]       = useState(false)
  const [toast, setToast]           = useState('')
  const [activeTab, setActiveTab]   = useState<'profile' | 'prizes' | 'data'>('profile')
  const [prizeFilter, setPrizeFilter] = useState<PrizeCategory | 'all'>('all')

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  const handleSaveName = () => {
    if (!newName.trim() || !currentUser) return
    updateName(currentUser.id, newName.trim())
    showToast('昵称已更新 ✅')
  }

  const handleSavePin = () => {
    if (!currentUser) return
    if (newPin.length < 4) { showToast('PIN 码至少 4 位'); return }
    if (newPin !== confirmPin) { showToast('两次 PIN 码不一致'); return }
    updatePin(currentUser.id, newPin)
    setNewPin('')
    setConfirmPin('')
    showToast('PIN 码已更新 ✅')
  }

  const filteredPrizes = prizeFilter === 'all'
    ? prizes
    : prizes.filter(p => p.category === prizeFilter)

  const categories: PrizeCategory[] = ['snack', 'fruit', 'cash', 'privilege', 'romantic']

  const partner = users.find(u => u.id !== currentUser?.id)

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800">设置</h1>
        <LoveQuoteSpot quote={loveQuotes[16]} icon="✨" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 bg-white/60 p-1 rounded-xl">
        {([['profile','个人'],['prizes','奖池'],['data','数据']] as const).map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab
                ? 'bg-gradient-to-r from-rose-400 to-purple-400 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}>
            {label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {/* Avatar picker */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              头像
              <LoveQuoteSpot quote={loveQuotes[0]} icon="🌸" />
            </h2>
            <div className="flex flex-wrap gap-3">
              {avatarOptions.map(a => (
                <button key={a} onClick={() => { if (currentUser) updateAvatar(currentUser.id, a); showToast('头像已更新 ✅') }}
                  className={`w-11 h-11 rounded-2xl text-2xl flex items-center justify-center transition-all ${
                    currentUser?.avatar === a
                      ? 'bg-gradient-to-br from-rose-400 to-purple-400 shadow-lg scale-110'
                      : 'bg-white/80 hover:bg-rose-50 hover:scale-105'
                  }`}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">昵称</h2>
            <div className="flex gap-2">
              <input type="text" value={newName} onChange={e => setNewName(e.target.value)}
                className="input-field flex-1" placeholder="你的昵称" />
              <button onClick={handleSaveName} className="btn-primary px-4 flex items-center gap-1.5">
                <Save size={15} /> 保存
              </button>
            </div>
          </div>

          {/* PIN */}
          <div className="glass-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3">修改 PIN 码</h2>
            <div className="space-y-3">
              <div className="relative">
                <input type={showPin ? 'text' : 'password'} value={newPin}
                  onChange={e => setNewPin(e.target.value)}
                  placeholder="新 PIN 码（至少 4 位）" className="input-field pr-11" maxLength={8} />
                <button type="button" onClick={() => setShowPin(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <input type={showPin ? 'text' : 'password'} value={confirmPin}
                onChange={e => setConfirmPin(e.target.value)}
                placeholder="确认新 PIN 码" className="input-field" maxLength={8} />
              <button onClick={handleSavePin} className="btn-primary w-full flex items-center justify-center gap-1.5">
                <Save size={15} /> 更新 PIN 码
              </button>
            </div>
          </div>

          {/* Partner info */}
          {partner && (
            <div className="glass-card p-5">
              <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                另一半
                <LoveQuoteSpot quote={loveQuotes[10]} icon="💕" />
              </h2>
              <div className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl">
                <span className="text-3xl">{partner.avatar}</span>
                <div>
                  <p className="font-semibold text-gray-700">{partner.name}</p>
                  <p className="text-xs text-gray-500">连续 {partner.streak} 天</p>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Prizes tab */}
      {activeTab === 'prizes' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              奖池总览（{prizes.length} 个奖项）
              <LoveQuoteSpot quote={loveQuotes[23]} icon="🎁" />
            </h2>

            {/* Category filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button onClick={() => setPrizeFilter('all')}
                className={`badge px-3 py-1 cursor-pointer ${prizeFilter === 'all' ? 'bg-rose-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                全部
              </button>
              {categories.map(c => {
                const cfg = prizeCategoryConfig[c]
                return (
                  <button key={c} onClick={() => setPrizeFilter(c)}
                    className={`badge px-3 py-1 cursor-pointer ${prizeFilter === c ? `${cfg.bg} ${cfg.color} ring-1 ring-current` : 'bg-gray-100 text-gray-600'}`}>
                    {cfg.label}
                  </button>
                )
              })}
            </div>

            <div className="space-y-1.5 max-h-96 overflow-y-auto scrollbar-hide">
              {filteredPrizes.map(p => {
                const cfg = prizeCategoryConfig[p.category]
                return (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-rose-50/50 transition-colors">
                    <span className="text-xl">{p.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">{p.name}</p>
                      {p.description && <p className="text-xs text-gray-400">{p.description}</p>}
                    </div>
                    <span className={`badge ${cfg.bg} ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>
      )}

      {/* Data tab */}
      {activeTab === 'data' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="glass-card p-5">
            <h2 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
              数据管理
              <LoveQuoteSpot quote={loveQuotes[27]} icon="💫" />
            </h2>
            <p className="text-xs text-gray-400 mb-4">所有数据存储在本地浏览器，不会上传至任何服务器</p>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: '任务数', value: tasks.length },
                { label: '抽奖记录', value: records.length },
                { label: '已兑换', value: records.filter(r => r.claimed).length },
              ].map(({ label, value }) => (
                <div key={label} className="text-center p-3 bg-gray-50 rounded-xl">
                  <p className="text-lg font-bold text-gray-700">{value}</p>
                  <p className="text-xs text-gray-400">{label}</p>
                </div>
              ))}
            </div>

            {/* Admin task management */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 mb-2">任务管理</h3>
              <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-hide">
                {tasks.map(t => (
                  <div key={t.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                    <span className="text-sm flex-1 truncate text-gray-600">{t.title}</span>
                    <button onClick={() => deleteTask(t.id)}
                      className="p-1 rounded-lg text-red-300 hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-800/90 text-white px-5 py-3 rounded-2xl shadow-xl z-50 text-sm font-medium"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
