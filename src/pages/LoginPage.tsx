import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import LoveQuoteSpot from '../components/LoveQuoteSpot'
import { loveQuotes } from '../data/quotes'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [error, setError] = useState('')
  const [shaking, setShaking] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const ok = login(name.trim(), pin.trim())
    if (ok) {
      navigate('/dashboard')
    } else {
      setError('姓名或 PIN 码不正确')
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-rose-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />

      {/* Corner love quotes */}
      <LoveQuoteSpot quote={loveQuotes[2]}  position="top-left"     icon="✨" />
      <LoveQuoteSpot quote={loveQuotes[7]}  position="top-right"    icon="🌸" />
      <LoveQuoteSpot quote={loveQuotes[15]} position="bottom-left"  icon="💫" />
      <LoveQuoteSpot quote={loveQuotes[22]} position="bottom-right" icon="🌙" />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-rose-400 to-purple-400 shadow-xl shadow-rose-200/60 mb-4"
          >
            <Heart size={36} className="text-white fill-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gradient tracking-tight">ForUs</h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-1">
            专属于我们的小世界
            <LoveQuoteSpot quote={loveQuotes[5]} icon="💕" />
          </p>
        </div>

        {/* Card */}
        <motion.div
          animate={shaking ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="glass-card p-8"
        >
          <h2 className="text-xl font-semibold text-gray-700 mb-6 text-center">欢迎回来 👋</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">你的名字</label>
              <input
                type="text"
                value={name}
                onChange={e => { setName(e.target.value); setError('') }}
                placeholder="请输入你的名字"
                className="input-field"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">PIN 码</label>
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError('') }}
                  placeholder="请输入 PIN 码"
                  className="input-field pr-11"
                  autoComplete="current-password"
                  maxLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-rose-500 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button type="submit" className="btn-primary w-full py-3 text-base mt-2">
              进入我们的世界 💕
            </button>
          </form>

        </motion.div>
      </motion.div>
    </div>
  )
}
