import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { getTodayPoem } from '../data/dailyContent'

export default function DailyPoem() {
  const poem = getTodayPoem()

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border border-purple-100 shadow-sm"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/40 rounded-full -translate-y-8 translate-x-8" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-pink-100/40 rounded-full translate-y-6 -translate-x-6" />

      <div className="relative">
        <div className="flex items-center gap-1.5 mb-2">
          <BookOpen size={13} className="text-purple-400" />
          <span className="text-xs text-purple-400 font-medium">每日诗词</span>
          <span className="ml-auto text-xs text-gray-400">{poem.dynasty} · {poem.author}</span>
        </div>

        <p className="text-xs font-medium text-purple-600 mb-1.5">《{poem.title}》</p>

        <div className="space-y-0.5 mb-3">
          {poem.lines.map((line, i) => (
            <p key={i} className="text-sm text-gray-700 leading-relaxed">{line}</p>
          ))}
        </div>

        <div className="border-t border-purple-100 pt-2">
          <p className="text-xs text-purple-500 italic leading-relaxed">💌 {poem.encouragement}</p>
        </div>
      </div>
    </motion.div>
  )
}
