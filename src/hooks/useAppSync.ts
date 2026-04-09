import { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useTaskStore } from '../store/useTaskStore'
import { useLotteryStore } from '../store/useLotteryStore'
import { usePrizeStore } from '../store/usePrizeStore'
import { supabase, dbGet, dbSet } from '../lib/supabase'
import type { User } from '../types'

let syncing = false
const pushTimers: Record<string, ReturnType<typeof setTimeout>> = {}

function schedPush(key: string, getValue: () => unknown) {
  if (syncing) return
  clearTimeout(pushTimers[key])
  pushTimers[key] = setTimeout(() => {
    dbSet(key, getValue()).catch(e => console.warn('[sync] push failed:', e))
  }, 500)
}

function applyRemote(key: string, value: unknown) {
  if (!value) return
  syncing = true
  try {
    if (key === 'forus-auth') {
      const v = value as { users: User[] }
      if (!v.users) return
      const { currentUser } = useAuthStore.getState()
      useAuthStore.setState({ users: v.users })
      if (currentUser) {
        const updated = v.users.find(u => u.id === currentUser.id)
        if (updated) useAuthStore.setState({ currentUser: updated })
      }
    }
    if (key === 'forus-tasks') {
      const v = value as { tasks: unknown[] }
      if (!v.tasks) return
      useTaskStore.setState({ tasks: v.tasks as never })
    }
    if (key === 'forus-lottery') {
      const v = value as { records: unknown[] }
      if (!v.records) return
      useLotteryStore.setState({ records: v.records as never })
    }
    if (key === 'forus-prizes') {
      const v = value as { prizes: unknown[] }
      if (!v.prizes) return
      usePrizeStore.setState({ prizes: v.prizes as never })
    }
  } finally {
    setTimeout(() => { syncing = false }, 200)
  }
}

async function fullSync() {
  try {
    const [auth, tasks, lottery, prizes] = await Promise.all([
      dbGet('forus-auth'),
      dbGet('forus-tasks'),
      dbGet('forus-lottery'),
      dbGet('forus-prizes'),
    ])
    if (auth) applyRemote('forus-auth', auth)
    else {
      const { users } = useAuthStore.getState()
      dbSet('forus-auth', { users }).catch(console.warn)
    }
    if (tasks) applyRemote('forus-tasks', tasks)
    if (lottery) applyRemote('forus-lottery', lottery)
    if (prizes) applyRemote('forus-prizes', prizes)
    else dbSet('forus-prizes', { prizes: usePrizeStore.getState().prizes }).catch(console.warn)
  } catch (e) {
    console.warn('[sync] initial sync failed:', e)
  }
}

export function useAppSync() {
  useEffect(() => {
    fullSync()

    const unsubAuth = useAuthStore.subscribe(state => {
      schedPush('forus-auth', () => ({ users: state.users }))
    })
    const unsubTasks = useTaskStore.subscribe(state => {
      schedPush('forus-tasks', () => ({ tasks: state.tasks }))
    })
    const unsubLottery = useLotteryStore.subscribe(state => {
      schedPush('forus-lottery', () => ({ records: state.records }))
    })
    const unsubPrizes = usePrizeStore.subscribe(state => {
      schedPush('forus-prizes', () => ({ prizes: state.prizes }))
    })

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
      supabase.removeChannel(channel)
    }
  }, [])
}
