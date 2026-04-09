import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Achievement } from '../data/achievements'
import { BADGE_IMAGES_PATH } from '../data/achievements'

interface Props {
  achievement: Achievement | null
  onClose: () => void
}

export default function AchievementPopup({ achievement, onClose }: Props) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    if (!achievement) return
    setImgError(false)
    const t = setTimeout(onClose, 5500)
    return () => clearTimeout(t)
  }, [achievement?.id])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: -60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-80 max-w-[92vw]"
        >
          <div className="glass-card overflow-hidden shadow-2xl border border-rose-200/60">
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400" />

            <div className="p-4">
              <p className="text-xs text-rose-500 font-semibold mb-2 flex items-center gap-1">
                🏅 成就解锁！
              </p>
              <div className="flex items-center gap-3 mb-3">
                {/* Badge image or emoji fallback */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-100 border border-amber-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {!imgError ? (
                    <img
                      src={`${BADGE_IMAGES_PATH}${achievement.imageFile}`}
                      alt={achievement.title}
                      className="w-full h-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <span className="text-3xl">{achievement.emoji}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-base">{achievement.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{achievement.desc}</p>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-rose-50/60 rounded-xl px-3 py-2 border border-rose-100">
                <p className="text-xs text-rose-600 italic leading-relaxed">
                  💌 {achievement.quote}
                </p>
              </div>
            </div>

            {/* Dismiss tap area */}
            <button
              onClick={onClose}
              className="absolute top-2 right-3 text-gray-300 hover:text-gray-500 text-lg leading-none"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
