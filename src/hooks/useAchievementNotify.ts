import { useEffect, useRef, useState } from 'react'
import { achievements, type Achievement } from '../data/achievements'
import { useAuthStore } from '../store/useAuthStore'

export function useAchievementNotify(
  tasks: number,
  streak: number,
  draws: number,
  userId: string
) {
  const { users, markAchievementSeen } = useAuthStore()
  const [queue, setQueue] = useState<Achievement[]>([])
  const [current, setCurrent] = useState<Achievement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!userId) return
    const user = users.find(u => u.id === userId)
    const seenSet = new Set(user?.seenAchievements ?? [])

    const newOnes = achievements.filter(
      a => a.check(tasks, streak, draws) && !seenSet.has(a.id)
    )

    if (newOnes.length > 0) {
      newOnes.forEach(a => markAchievementSeen(userId, a.id))
      if (initialized.current) {
        setQueue(prev => [...prev, ...newOnes])
      }
    }
    initialized.current = true
  }, [tasks, streak, draws, userId])

  useEffect(() => {
    if (!current && queue.length > 0) {
      setCurrent(queue[0])
      setQueue(prev => prev.slice(1))
    }
  }, [queue, current])

  const dismiss = () => setCurrent(null)

  return { current, dismiss }
}
