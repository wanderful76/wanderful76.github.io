import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { prizeCategoryConfig } from '../data/prizes'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import { loveQuotes } from '../data/quotes'
import { achievements, BADGE_IMAGES_PATH } from '../data/achievements'
import type { Achievement } from '../data/achievements'
import type { PrizeCategory } from '../types'

function BadgeIcon({ achievement: a, unlocked, size = 10 }: { achievement: Achievement; unlocked: boolean; size?: number }) {
  const [imgErr, setImgErr] = useState(false)
  return (
    <div className={`w-${size} h-${size} rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden
      ${unlocked ? 'bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200' : 'bg-gray-100 border border-gray-200'}`}>
      {!imgErr ? (
        <img
          src={`${BADGE_IMAGES_PATH}${a.imageFile}`}
          alt={a.title}
          className={`w-full h-full object-cover ${unlocked ? '' : 'grayscale opacity-40'}`}
          onError={() => setImgErr(true)}
        />
      ) : (
        <span className={`text-xl ${unlocked ? '' : 'grayscale opacity-40'}`}>{a.emoji}</span>
      )}
    </div>
  )
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function StatsPage() {
  const { currentUser, users } = useAuthStore()
  const { tasks } = useTaskStore()
  const { records, getStatsByCategory } = useLotteryStore()

  const myDraws   = records.filter(r => r.userId === currentUser?.id).length
  const catStats  = getStatsByCategory(currentUser?.id)
  const myTasks   = currentUser?.totalTasksCompleted ?? 0
  const myStreak  = currentUser?.streak ?? 0
  const myTickets = currentUser?.tickets ?? 0

  const completedTasks  = tasks.filter(t => t.status === 'completed').length
  const totalTasks      = tasks.length
  const completionRate  = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const categories: PrizeCategory[] = ['snack', 'fruit', 'cash', 'privilege', 'romantic']
  const maxCatCount = Math.max(...categories.map(c => catStats[c] || 0), 1)

  const partner = users.find(u => u.id !== currentUser?.id)

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-5">
      <motion.div variants={item} className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-800">数据统计</h1>
        <LoveQuoteSpot quote={loveQuotes[8]} icon="✨" />
      </motion.div>

      {/* Key stats */}
      <motion.div variants={item} className="grid grid-cols-2 gap-3">
        {[
          { label: '累计完成任务', value: myTasks,   emoji: '✅', color: 'from-green-400 to-emerald-400'  },
          { label: '当前连续天数', value: myStreak,  emoji: '🔥', color: 'from-orange-400 to-amber-400'   },
          { label: '剩余抽奖券',   value: myTickets, emoji: '🎟️', color: 'from-amber-400 to-yellow-400'   },
          { label: '累计抽奖次数', value: myDraws,   emoji: '🎁', color: 'from-purple-400 to-pink-400'    },
        ].map(({ label, value, emoji, color }) => (
          <div key={label} className="glass-card p-4 text-center">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-2 text-2xl shadow-md`}>
              {emoji}
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* Task completion rate */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          📋 任务完成率
          <LoveQuoteSpot quote={loveQuotes[13]} icon="🌸" />
        </h2>
        <div className="flex items-end gap-4">
          <div className="text-4xl font-bold text-gradient">{completionRate}%</div>
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>已完成 {completedTasks}</span>
              <span>共 {totalTasks} 个</span>
            </div>
            <div className="h-3 bg-rose-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
                className="h-full bg-gradient-to-r from-rose-400 to-purple-400 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Prize category distribution */}
      {myDraws > 0 && (
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            🎀 奖品分布
            <LoveQuoteSpot quote={loveQuotes[20]} icon="💫" />
          </h2>
          <div className="space-y-2.5">
            {categories.map(cat => {
              const cfg   = prizeCategoryConfig[cat]
              const count = catStats[cat] || 0
              const pct   = maxCatCount > 0 ? (count / maxCatCount) * 100 : 0
              return (
                <div key={cat} className="flex items-center gap-3">
                  <span className={`badge ${cfg.bg} ${cfg.color} w-16 justify-center flex-shrink-0`}>{cfg.label}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                      className="h-full bg-gradient-to-r from-rose-300 to-purple-300 rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-500 w-6 text-right">{count}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Achievements */}
      <motion.div variants={item} className="glass-card p-5">
        <h2 className="font-semibold text-gray-700 mb-1 flex items-center gap-2">
          🏅 成就徽章
          <LoveQuoteSpot quote={loveQuotes[24]} icon="⭐" />
          <span className="ml-auto text-xs text-gray-400">
            {achievements.filter(a => a.check(myTasks, myStreak, myDraws)).length} / {achievements.length}
          </span>
        </h2>
        <p className="text-xs text-gray-400 mb-4">集满所有徽章可解锁隐藏大奖 👀</p>
        <div className="grid grid-cols-2 gap-2.5">
          {achievements.map(a => {
            const unlocked = a.check(myTasks, myStreak, myDraws)
            return (
              <div key={a.id} className={`flex items-center gap-2.5 p-3 rounded-xl transition-all ${
                unlocked
                  ? 'bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200/50'
                  : 'bg-gray-50 opacity-50'
              }`}>
                <BadgeIcon achievement={a} unlocked={unlocked} size={10} />
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>{a.title}</p>
                  <p className="text-xs text-gray-400 truncate">{a.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Grand prize hint – shown when all unlocked */}
        {achievements.every(a => a.check(myTasks, myStreak, myDraws)) ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mt-4 rounded-2xl p-4 text-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 40%, #ec4899 100%)' }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 80%, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative">
              <div className="text-3xl mb-1">🎉</div>
              <p className="text-white font-bold text-base">成就全满！神秘大奖已解锁</p>
              <p className="text-white/80 text-xs mt-0.5 mb-3">截图并发给对方，一起去领取属于你们的奖励 💪</p>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-2xl px-5 py-2.5">
                <span className="text-2xl">�</span>
                <div className="text-left">
                  <p className="text-white/70 text-xs">奖励金额</p>
                  <p className="text-white font-black text-2xl tracking-widest">¥ ? ? ? . ?</p>
                </div>
              </div>
              <p className="text-white/60 text-xs mt-2">「记住彼此约定过的那个数字」</p>
            </div>
          </motion.div>
        ) : (
          /* Hint card when not yet complete */
          <div className="mt-4 rounded-2xl p-3 bg-gray-50 border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400">🔒 集满全部 {achievements.length} 枚徽章，解锁一份隐藏的特别奖励</p>
            <p className="text-xs text-gray-300 mt-0.5">「某个你们都懂的数字…」</p>
          </div>
        )}
      </motion.div>

      {/* Partner comparison */}
      {partner && (
        <motion.div variants={item} className="glass-card p-5">
          <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
            💑 与 {partner.avatar}{partner.name} 的对比
            <LoveQuoteSpot quote={loveQuotes[29]} icon="🌸" />
          </h2>
          <div className="space-y-3">
            {[
              { label: '完成任务', me: myTasks, them: partner.totalTasksCompleted },
              { label: '连续天数', me: myStreak, them: partner.streak },
              { label: '抽奖次数', me: myDraws, them: records.filter(r => r.userId === partner.id).length },
            ].map(({ label, me, them }) => {
              const total = me + them || 1
              const myPct   = Math.round((me / total) * 100)
              return (
                <div key={label}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{currentUser?.name} {me}</span>
                    <span className="font-medium text-gray-600">{label}</span>
                    <span>{partner.name} {them}</span>
                  </div>
                  <div className="h-2.5 bg-purple-100 rounded-full overflow-hidden flex">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${myPct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-l-full"
                    />
                    <div className="flex-1 bg-gradient-to-r from-purple-300 to-indigo-300 rounded-r-full" />
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      <motion.div variants={item} className="h-2" />
    </motion.div>
  )
}
