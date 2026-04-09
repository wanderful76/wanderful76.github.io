import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  quote: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'inline'
  icon?: string
  className?: string
}

export default function LoveQuoteSpot({ quote, position = 'inline', icon = '✨', className = '' }: Props) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const positionClass: Record<string, string> = {
    'top-left':     'fixed top-4 left-4 z-40',
    'top-right':    'fixed top-4 right-4 z-40',
    'bottom-left':  'fixed bottom-20 left-4 z-40',
    'bottom-right': 'fixed bottom-20 right-4 z-40',
    'inline':       'relative inline-block',
  }

  const tooltipClass: Record<string, string> = {
    'top-left':     'top-9 left-0',
    'top-right':    'top-9 right-0',
    'bottom-left':  'bottom-9 left-0',
    'bottom-right': 'bottom-9 right-0',
    'inline':       'bottom-full left-1/2 -translate-x-1/2 mb-2',
  }

  const handleEnter = () => {
    if (timer.current) clearTimeout(timer.current)
    setVisible(true)
  }
  const handleLeave = () => {
    timer.current = setTimeout(() => setVisible(false), 150)
  }

  return (
    <span
      className={`${positionClass[position]} ${className} quote-spot select-none`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <span className="text-rose-300 hover:text-rose-400 transition-colors duration-200 cursor-default text-lg leading-none">
        {icon}
      </span>

      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className={`absolute ${tooltipClass[position]} w-64 z-50 pointer-events-none`}
          >
            <div className="bg-white/95 backdrop-blur-sm border border-rose-200/60 rounded-2xl px-4 py-3 shadow-xl shadow-rose-100/50">
              <p className="text-sm text-gray-600 leading-relaxed font-light italic text-center">
                「{quote}」
              </p>
            </div>
            {position === 'inline' && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full w-2.5 h-2.5 bg-white/95 border-b border-r border-rose-200/60 rotate-45 -mt-1.5" />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  )
}
