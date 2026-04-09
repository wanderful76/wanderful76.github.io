import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../store/useAuthStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { prizeCategoryConfig } from '../data/prizes'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import { loveQuotes } from '../data/quotes'
import type { LotteryRecord } from '../types'

type Phase = 'idle' | 'shaking' | 'opening' | 'revealed'

export default function LotteryPage() {
  const { currentUser, useTickets } = useAuthStore()
  const { draw, records, claimPrize } = useLotteryStore()
  const [phase, setPhase] = useState<Phase>('idle')
  const [result, setResult] = useState<LotteryRecord | null>(null)
  const [error, setError] = useState('')
  const myRecords = records.filter(r => r.userId === currentUser?.id)

  const handleDraw = async () => {
    if (!currentUser) return
    if (currentUser.tickets < 1) {
      setError('抽奖券不足，完成任务获得更多！')
      return
    }
    setError('')
    const ok = useTickets(currentUser.id, 1)
    if (!ok) { setError('操作失败，请重试'); return }

    setPhase('shaking')
    await delay(700)
    setPhase('opening')
    await delay(500)
    const record = draw(currentUser.id, currentUser.name)
    setResult(record)
    setPhase('revealed')
  }

  const handleReset = () => {
    setPhase('idle')
    setResult(null)
  }

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms))

  const catCfg = result ? prizeCategoryConfig[result.prizeCategory] : null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          盲盒抽奖
          <LoveQuoteSpot quote={loveQuotes[4]} icon="✨" />
        </h1>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
          <span>🎟️</span>
          <span className="text-sm font-bold text-amber-600">{currentUser?.tickets ?? 0} 张</span>
        </div>
      </div>

      {/* Blind box area */}
      <div className="glass-card p-8 flex flex-col items-center gap-6">
        {/* Box */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {phase !== 'revealed' ? (
              <motion.div
                key="box"
                animate={phase === 'shaking' ? {
                  x: [-6, 6, -5, 5, -3, 3, -1, 1, 0],
                  rotate: [-3, 3, -2, 2, -1, 1, 0],
                } : {}}
                transition={{ duration: 0.6 }}
                className="relative cursor-pointer select-none"
                onClick={phase === 'idle' ? handleDraw : undefined}
              >
                <div className={`w-48 h-48 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-300 ${
                  phase === 'opening'
                    ? 'scale-90 opacity-30'
                    : 'hover:scale-105 hover:shadow-rose-200/60'
                } bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400`}>
                  <div className="text-center">
                    {phase === 'idle' && (
                      <>
                        <div className="text-6xl mb-2">🎁</div>
                        <p className="text-white font-bold text-sm">点击开箱</p>
                      </>
                    )}
                    {phase === 'shaking' && <div className="text-6xl animate-bounce">🎁</div>}
                    {phase === 'opening' && <div className="text-6xl">✨</div>}
                  </div>
                </div>
                {/* Ribbon */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-0 right-0 h-3 bg-white/20 -translate-y-1/2 rounded" />
                  <div className="absolute top-0 bottom-0 left-1/2 w-3 bg-white/20 -translate-x-1/2 rounded" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white/30 rounded-full" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ scale: 0, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                className="w-48 h-48 rounded-3xl flex flex-col items-center justify-center shadow-2xl shadow-rose-200/50 bg-gradient-to-br from-rose-50 to-purple-50 border-2 border-rose-200"
              >
                <div className="text-6xl mb-2">{result?.prizeEmoji}</div>
                <div className={`badge ${catCfg?.bg} ${catCfg?.color} text-xs mb-1`}>{catCfg?.label}</div>
                <p className="text-center text-sm font-bold text-gray-700 px-3 leading-tight">{result?.prizeName}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Confetti on reveal */}
          {phase === 'revealed' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
              {['🌸','⭐','💕','✨','🎊','💫'].map((e, i) => (
                <motion.div key={i}
                  initial={{ y: 0, x: Math.random() * 160 - 40, opacity: 1, scale: 1 }}
                  animate={{ y: -80, opacity: 0, scale: 0.5, rotate: Math.random() * 360 }}
                  transition={{ duration: 0.8 + i * 0.1, delay: i * 0.07 }}
                  className="absolute text-xl"
                  style={{ left: `${15 + i * 14}%`, top: '60%' }}
                >
                  {e}
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {phase === 'idle' && (
          <div className="text-center">
            <button onClick={handleDraw} disabled={(currentUser?.tickets ?? 0) < 1}
              className="btn-primary px-8 py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed">
              消耗 1 张券开箱 🎁
            </button>
            {error && <p className="text-rose-500 text-sm mt-2">{error}</p>}
            <p className="text-gray-400 text-xs mt-3 flex items-center justify-center gap-1">
              完成任务获得抽奖券
              <LoveQuoteSpot quote={loveQuotes[12]} icon="💕" />
            </p>
          </div>
        )}

        {phase === 'revealed' && result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-3 w-full">
            <p className="text-lg font-bold text-gradient">恭喜获得！</p>
            {result.prizeCategory === 'cash' && (
              <p className="text-sm text-gray-500">{result.prizeName.split('—')[1]?.trim() ?? ''}</p>
            )}
            <div className="flex gap-3 justify-center">
              {!result.claimed && (
                <button onClick={() => { claimPrize(result.id); setResult({ ...result, claimed: true }) }}
                  className="btn-primary px-5 py-2 text-sm">
                  标记已兑换 ✅
                </button>
              )}
              {result.claimed && (
                <span className="badge bg-green-100 text-green-600 px-3 py-1.5 text-sm">已兑换 ✓</span>
              )}
              <button onClick={handleReset} className="btn-secondary px-5 py-2 text-sm">再抽一次</button>
            </div>
          </motion.div>
        )}
      </div>

      {/* History */}
      <div className="glass-card p-5">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🎀 抽奖记录
          <LoveQuoteSpot quote={loveQuotes[18]} icon="🌸" />
        </h2>

        {myRecords.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">还没有抽奖记录，快去完成任务吧！</p>
        ) : (
          <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-hide">
            {myRecords.map(r => {
              const cfg = prizeCategoryConfig[r.prizeCategory]
              return (
                <div key={r.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50/80 hover:bg-rose-50/50 transition-colors">
                  <span className="text-2xl">{r.prizeEmoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-700 truncate">{r.prizeName}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`badge ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString('zh-CN')}</span>
                    </div>
                  </div>
                  {r.claimed
                    ? <span className="text-xs text-green-500 font-medium flex-shrink-0">已兑换</span>
                    : <button onClick={() => claimPrize(r.id)} className="text-xs text-rose-400 hover:text-rose-600 flex-shrink-0 font-medium">
                        兑换
                      </button>
                  }
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
