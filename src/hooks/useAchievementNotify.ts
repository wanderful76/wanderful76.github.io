import { useEffect, useRef, useState } from 'react'
import { achievements, type Achievement } from '../data/achievements'

function getSeenKey(userId: string) {
  return `forus-seen-achievements-${userId}`
}

export function useAchievementNotify(
  tasks: number,
  streak: number,
  draws: number,
  userId: string
) {
  const [queue, setQueue] = useState<Achievement[]>([])
  const [current, setCurrent] = useState<Achievement | null>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (!userId) return
    const key = getSeenKey(userId)
    const seen: string[] = JSON.parse(localStorage.getItem(key) || '[]')
    const seenSet = new Set(seen)

    const newOnes = achievements.filter(
      a => a.check(tasks, streak, draws) && !seenSet.has(a.id)
    )

    if (newOnes.length > 0) {
      const updated = [...seen, ...newOnes.map(a => a.id)]
      localStorage.setItem(key, JSON.stringify(updated))
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
