import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { usePrizeStore } from '../store/usePrizeStore'
import { useWishStore } from '../store/useWishStore'
import { useReminderStore } from '../store/useReminderStore'
import { supabase, dbGet, dbSet } from '../lib/supabase'
import type { User } from '../types'

let syncing = false
const pushTimers: Record<string, ReturnType<typeof setTimeout>> = {}

function schedPush(key: string) {
  if (syncing) return
  clearTimeout(pushTimers[key])
  pushTimers[key] = setTimeout(() => {
    let payload: unknown
    if (key === 'forus-auth')      payload = { users: useAuthStore.getState().users }
    if (key === 'forus-tasks')     payload = { tasks: useTaskStore.getState().tasks }
    if (key === 'forus-lottery')   payload = { records: useLotteryStore.getState().records }
    if (key === 'forus-prizes')    payload = { prizes: usePrizeStore.getState().prizes }
    if (key === 'forus-wishes')    payload = { wishes: useWishStore.getState().wishes }
    if (key === 'forus-reminders') payload = { reminders: useReminderStore.getState().reminders }
    if (payload) dbSet(key, payload).catch(e => console.warn('[sync] push failed:', e))
  }, 500)
}

function mergeById<T extends { id: string | number }>(remote: T[], local: T[]): T[] {
  const remoteIds = new Set(remote.map(item => item.id))
  const localOnly = local.filter(item => !remoteIds.has(item.id))
  return [...remote, ...localOnly]
}

function applyRemote(key: string, value: unknown) {
  if (!value) return
  syncing = true
  try {
    if (key === 'forus-auth') {
      const v = value as { users: User[] }
      if (!v.users) return
      const users = v.users.map(u => u.id === 'user1' ? { ...u, isAdmin: true } : u)
      const { currentUser } = useAuthStore.getState()
      useAuthStore.setState({ users })
      if (currentUser) {
        const updated = users.find(u => u.id === currentUser.id)
        if (updated) useAuthStore.setState({ currentUser: updated })
      }
    }
    if (key === 'forus-tasks') {
      const v = value as { tasks: import('../types').Task[] }
      if (!v.tasks) return
      const local = useTaskStore.getState().tasks
      const merged = mergeById(v.tasks, local)
      useTaskStore.setState({ tasks: merged })
    }
    if (key === 'forus-lottery') {
      const v = value as { records: import('../types').LotteryRecord[] }
      if (!v.records) return
      const local = useLotteryStore.getState().records
      const merged = mergeById(v.records, local)
      useLotteryStore.setState({ records: merged })
    }
    if (key === 'forus-prizes') {
      const v = value as { prizes: unknown[] }
      if (!v.prizes) return
      usePrizeStore.setState({ prizes: v.prizes as never })
    }
    if (key === 'forus-wishes') {
      const v = value as { wishes: import('../types').WishItem[] }
      if (!v.wishes) return
      const local = useWishStore.getState().wishes
      useWishStore.setState({ wishes: mergeById(v.wishes, local) })
    }
    if (key === 'forus-reminders') {
      const v = value as { reminders: import('../types').Reminder[] }
      if (!v.reminders) return
      const local = useReminderStore.getState().reminders
      useReminderStore.setState({ reminders: mergeById(v.reminders, local) })
    }
  } finally {
    setTimeout(() => { syncing = false }, 200)
  }
}

async function fullSync() {
  try {
    const [auth, tasks, lottery, prizes, wishes, reminders] = await Promise.all([
      dbGet('forus-auth'),
      dbGet('forus-tasks'),
      dbGet('forus-lottery'),
      dbGet('forus-prizes'),
      dbGet('forus-wishes'),
      dbGet('forus-reminders'),
    ])
    if (auth) applyRemote('forus-auth', auth)
    else {
      const { users, currentUser } = useAuthStore.getState()
      dbSet('forus-auth', { users }).catch(console.warn)
      if (currentUser) {
        const fresh = users.find(u => u.id === currentUser.id)
        if (fresh) useAuthStore.setState({ currentUser: fresh })
      }
    }
    if (tasks) applyRemote('forus-tasks', tasks)
    if (lottery) applyRemote('forus-lottery', lottery)
    if (prizes) applyRemote('forus-prizes', prizes)
    else dbSet('forus-prizes', { prizes: usePrizeStore.getState().prizes }).catch(console.warn)
    if (wishes) applyRemote('forus-wishes', wishes)
    if (reminders) applyRemote('forus-reminders', reminders)
  } catch (e) {
    console.warn('[sync] initial sync failed:', e)
  }
}

export function useAppSync() {
  useEffect(() => {
    fullSync()

    const unsubAuth      = useAuthStore.subscribe(()     => schedPush('forus-auth'))
    const unsubTasks     = useTaskStore.subscribe(()     => schedPush('forus-tasks'))
    const unsubLottery   = useLotteryStore.subscribe(()  => schedPush('forus-lottery'))
    const unsubPrizes    = usePrizeStore.subscribe(()    => schedPush('forus-prizes'))
    const unsubWishes    = useWishStore.subscribe(()     => schedPush('forus-wishes'))
    const unsubReminders = useReminderStore.subscribe(() => schedPush('forus-reminders'))

    const channel = supabase
      .channel('forus-sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'sync_data' },
        payload => {
          const row = payload.new as { key: string; value: unknown }
          applyRemote(row.key, row.value)
        }
      )
      .subscribe()

    return () => {
      unsubAuth()
      unsubTasks()
      unsubLottery()
      unsubPrizes()
      unsubWishes()
      unsubReminders()
      supabase.removeChannel(channel)
    }
  }, [])
}
