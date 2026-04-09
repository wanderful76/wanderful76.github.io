import { motion } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { getCurrentLevel, getNextLevel, getLevelProgress } from '../data/levels'

export default function CoupleGrowth() {
  const { users } = useAuthStore()
  const total = users.reduce((sum, u) => sum + u.totalTasksCompleted, 0)
  const level = getCurrentLevel(total)
  const next = getNextLevel(total)
  const progress = getLevelProgress(total)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 ${level.bgColor} border border-white/80 shadow-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{level.emoji}</span>
          <div>
            <p className={`font-semibold text-sm ${level.color}`}>{level.name}</p>
            <p className="text-xs text-gray-400">{level.description}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">共完成</p>
          <p className={`text-lg font-bold ${level.color}`}>{total}</p>
          <p className="text-xs text-gray-400">个任务</p>
        </div>
      </div>

      {next ? (
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>距离「{next.name} {next.emoji}」</span>
            <span>{next.minTasks - total} 个</span>
          </div>
          <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full bg-gradient-to-r from-rose-300 to-purple-400`}
            />
          </div>
        </div>
      ) : (
        <p className={`text-xs text-center font-medium ${level.color} mt-1`}>
          ✨ 已达到最高境界，爱情永恒！
        </p>
      )}
    </motion.div>
  )
}
