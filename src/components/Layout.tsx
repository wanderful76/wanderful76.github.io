import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ListTodo, Gift, BarChart2, Settings, LogOut, BookHeart } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { loveQuotes } from '../data/quotes'
import LoveQuoteSpot from './LoveQuoteSpot'

function getDailyCornerQuotes() {
  const day  = Math.floor(Date.now() / 86400000)
  const n    = loveQuotes.length
  const step = Math.floor(n / 4)
  return [0, 1, 2, 3].map(i => loveQuotes[(day + i * step) % n])
}

const cornerQuotes = getDailyCornerQuotes()

export default function Layout({ children }: { children: React.ReactNode }) {
  const { currentUser, logout, users } = useAuthStore()
  const { records } = useLotteryStore()
  const navigate = useNavigate()

  const partner = users.find(u => u.id !== currentUser?.id)
  const partnerNewDraws = partner
    ? records.filter(r => {
        if (r.userId !== partner.id) return false
        if (!currentUser?.lastSeenPartnerDrawAt) return true
        return new Date(r.date) > new Date(currentUser.lastSeenPartnerDrawAt)
      }).length
    : 0

  const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: '首页',  badge: partnerNewDraws > 0 },
    { to: '/tasks',     icon: ListTodo,        label: '任务',  badge: false },
    { to: '/lottery',   icon: Gift,            label: '抽奖',  badge: false },
    { to: '/memos',     icon: BookHeart,       label: '记录',  badge: false },
    { to: '/stats',     icon: BarChart2,       label: '统计',  badge: false },
    { to: '/settings',  icon: Settings,        label: '设置',  badge: false },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed love quote spots at page corners - hidden on mobile */}
      <div className="hidden sm:block">
        <LoveQuoteSpot quote={cornerQuotes[0]} position="top-left"     icon="✨" />
        <LoveQuoteSpot quote={cornerQuotes[1]} position="top-right"    icon="🌸" />
        <LoveQuoteSpot quote={cornerQuotes[2]} position="bottom-left"  icon="💫" />
        <LoveQuoteSpot quote={cornerQuotes[3]} position="bottom-right" icon="🌙" />
      </div>

      {/* Top header */}
      <header className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-rose-100/60 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">💕</span>
            <span className="font-bold text-gradient text-lg tracking-tight">ForUs</span>
          </div>

          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-rose-50 rounded-full px-3 py-1">
                <span className="text-base">{currentUser.avatar}</span>
                <span className="text-sm font-medium text-rose-600">{currentUser.name}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 rounded-full px-3 py-1">
                <span className="text-sm">🎟️</span>
                <span className="text-sm font-semibold text-amber-600">{currentUser.tickets}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-xl text-gray-400 hover:text-rose-400 hover:bg-rose-50 transition-colors"
                title="退出登录"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-6 pb-24">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/80 backdrop-blur-md border-t border-rose-100/60 shadow-lg">
        <div className="max-w-2xl mx-auto px-2 flex">
          {navItems.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 rounded-xl mx-0.5 transition-all duration-200 ${
                  isActive
                    ? 'text-rose-500 bg-rose-50'
                    : 'text-gray-400 hover:text-rose-400 hover:bg-rose-50/50'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                    {badge && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <span className={`text-xs font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
