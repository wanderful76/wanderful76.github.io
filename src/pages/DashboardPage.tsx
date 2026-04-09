import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Clock, Ticket, TrendingUp, ChevronRight, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { prizeCategoryConfig } from '../data/prizes'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import DailyPoem from '../components/DailyPoem'
import CoupleGrowth from '../components/CoupleGrowth'
import { loveQuotes } from '../data/quotes'

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const { currentUser, users, markPartnerDrawSeen } = useAuthStore()
  const { getTodayTasks } = useTaskStore()
  const { records } = useLotteryStore()

  const todayTasks = getTodayTasks()
  const completedToday = todayTasks.filter(t => t.status === 'completed').length
  const pendingToday = todayTasks.filter(t => t.status !== 'completed').length
  const partner = users.find(u => u.id !== currentUser?.id)
  const recentPrizes = records.slice(0, 3)

  const partnerNewDraws = partner
    ? records.filter(r => {
        if (r.userId !== partner.id) return false
        if (!currentUser?.lastSeenPartnerDrawAt) return true
        return new Date(r.date) > new Date(currentUser.lastSeenPartnerDrawAt)
      })
    : []

  useEffect(() => {
    if (currentUser && partnerNewDraws.length > 0) {
      const timer = setTimeout(() => markPartnerDrawSeen(currentUser.id), 3000)
      return () => clearTimeout(timer)
    }
  }, [currentUser?.id])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 6)  return '夜深了，要早点休息哦 🌙'
    if (h < 12) return '早上好，今天也要加油！☀️'
    if (h < 14) return '午安，记得好好吃饭 🍱'
    if (h < 18) return '下午好，继续努力！💪'
    return '晚上好，辛苦了一天 🌸'
  }

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">

      {/* Greeting */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-500 text-sm">{greeting()}</p>
            <h1 className="text-2xl font-bold text-gray-800 mt-0.5 flex items-center gap-2">
              {currentUser?.avatar} {currentUser?.name}
              <LoveQuoteSpot quote={loveQuotes[1]} icon="💕" />
            </h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">今日任务</p>
            <p className="text-2xl font-bold text-gradient">
              {completedToday}<span className="text-gray-300 text-lg">/{todayTasks.length}</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {todayTasks.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1.5">
              <span>今日进度</span>
              <span>{Math.round((completedToday / todayTasks.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(completedToday / todayTasks.length) * 100}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Stats row */}
      <motion.div variants={item} className="grid grid-cols-3 gap-3">
        {[
          { icon: '🎟️', label: '抽奖券', value: currentUser?.tickets ?? 0, color: 'text-amber-500', bg: 'bg-amber-50' },
          { icon: '🔥', label: '连续天数', value: currentUser?.streak ?? 0, color: 'text-orange-500', bg: 'bg-orange-50' },
          { icon: '✅', label: '累计完成', value: currentUser?.totalTasksCompleted ?? 0, color: 'text-green-500', bg: 'bg-green-50' },
        ].map(({ icon, label, value, color, bg }) => (
          <div key={label} className={`glass-card p-4 text-center ${bg}`}>
            <div className="text-2xl mb-1">{icon}</div>
            <div className={`text-xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{label}</div>
          </div>
        ))}
      </motion.div>

      {/* Daily poem */}
      <motion.div variants={item}>
        <DailyPoem />
      </motion.div>

      {/* Couple growth */}
      <motion.div variants={item}>
        <CoupleGrowth />
      </motion.div>

      {/* Quick actions */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        <button
          onClick={() => navigate('/tasks')}
          className="glass-card p-4 flex items-center gap-3 hover:shadow-md hover:bg-rose-50/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-400 flex items-center justify-center shadow-md shadow-rose-200/50">
            <CheckCircle2 size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">完成任务</p>
            <p className="text-xs text-gray-400">还有 {pendingToday} 个待完成</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/lottery')}
          className="glass-card p-4 flex items-center gap-3 hover:shadow-md hover:bg-purple-50/50 transition-all text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-400 flex items-center justify-center shadow-md shadow-purple-200/50">
            <Ticket size={20} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-700 text-sm">去抽奖</p>
            <p className="text-xs text-gray-400">已有 {currentUser?.tickets ?? 0} 张券</p>
          </div>
        </button>
      </motion.div>

      {/* Today's tasks */}
      <motion.div variants={item} className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700 flex items-center gap-2">
            <Clock size={16} className="text-rose-400" /> 今日任务
            <LoveQuoteSpot quote={loveQuotes[3]} icon="✨" />
          </h2>
          <button onClick={() => navigate('/tasks')} className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-0.5">
            全部 <ChevronRight size={14} />
          </button>
        </div>

        {todayTasks.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">暂无任务，去设置页面添加吧~</p>
        ) : (
          <div className="space-y-2.5">
            {todayTasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.status === 'completed'
                    ? 'bg-green-400 border-green-400'
                    : task.status === 'in_progress'
                      ? 'border-amber-400 bg-amber-50'
                      : 'border-gray-300'
                }`}>
                  {task.status === 'completed' && <CheckCircle2 size={12} className="text-white fill-white" />}
                </div>
                <span className={`text-sm flex-1 ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {task.title}
                </span>
                <span className="text-xs text-amber-500 font-medium">🎟 +1</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Partner status */}
      {partner && (
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-purple-400" />
            {partner.avatar} {partner.name} 的动态
            <LoveQuoteSpot quote={loveQuotes[11]} icon="🌸" />
          </h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-purple-500">{partner.tickets}</p>
              <p className="text-xs text-gray-400">抽奖券</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-500">{partner.streak}</p>
              <p className="text-xs text-gray-400">连续天数</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-500">{partner.totalTasksCompleted}</p>
              <p className="text-xs text-gray-400">累计完成</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Partner new draws notification */}
      {partnerNewDraws.length > 0 && partner && (
        <motion.div variants={item}
          className="glass-card p-5 border-2 border-rose-200 bg-gradient-to-br from-rose-50/80 to-purple-50/80">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Bell size={16} className="text-rose-500 animate-bounce" />
              <h2 className="font-semibold text-rose-600">
                {partner.avatar} {partner.name} 刚抽到新奖励！
              </h2>
            </div>
            <span className="badge bg-rose-500 text-white ml-auto">{partnerNewDraws.length} 条新</span>
          </div>
          <div className="space-y-2">
            {partnerNewDraws.slice(0, 3).map(r => {
              const cfg = prizeCategoryConfig[r.prizeCategory]
              return (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70">
                  <span className="text-2xl">{r.prizeEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-700 truncate">{r.prizeName}</p>
                    <p className="text-xs text-gray-400">{new Date(r.date).toLocaleString('zh-CN', { month:'numeric', day:'numeric', hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                  <span className={`badge ${cfg.bg} ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                </div>
              )
            })}
          </div>
          {partnerNewDraws.length > 3 && (
            <p className="text-xs text-center text-rose-400 mt-2">还有 {partnerNewDraws.length - 3} 条，去抽奖页查看</p>
          )}
        </motion.div>
      )}

      {/* Recent prizes */}
      {recentPrizes.length > 0 && (
        <motion.div variants={item} className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center gap-2">
              🎁 最近获得
              <LoveQuoteSpot quote={loveQuotes[19]} icon="💫" />
            </h2>
            <button onClick={() => navigate('/lottery')} className="text-xs text-rose-400 hover:text-rose-600 flex items-center gap-0.5">
              查看全部 <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-2">
            {recentPrizes.map(r => (
              <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl bg-rose-50/50">
                <span className="text-xl">{r.prizeEmoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{r.prizeName}</p>
                  <p className="text-xs text-gray-400">{r.userName} · {new Date(r.date).toLocaleDateString('zh-CN')}</p>
                </div>
                {!r.claimed && (
                  <span className="badge bg-rose-100 text-rose-500 flex-shrink-0">待兑换</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="h-2" />
    </motion.div>
  )
}
