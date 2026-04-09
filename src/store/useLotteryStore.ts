import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LotteryRecord, PrizeCategory } from '../types'
import { usePrizeStore } from './usePrizeStore'

interface LotteryStore {
  records: LotteryRecord[]
  draw: (userId: string, userName: string) => LotteryRecord
  claimPrize: (recordId: string) => void
  getRecordsByUser: (userId: string) => LotteryRecord[]
  getStatsByCategory: (userId?: string) => Record<PrizeCategory, number>
  getTotalDraws: (userId?: string) => number
  clearRecords: () => void
}

export const useLotteryStore = create<LotteryStore>()(
  persist(
    (set, get) => ({
      records: [],

      draw: (userId, userName) => {
        const allPrizes = usePrizeStore.getState().prizes
        const prize = allPrizes[Math.floor(Math.random() * allPrizes.length)]
        const record: LotteryRecord = {
          id: `draw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          prizeId: prize.id,
          prizeName: prize.name,
          prizeEmoji: prize.emoji,
          prizeCategory: prize.category,
          date: new Date().toISOString(),
          userId,
          userName,
          claimed: false,
        }
        set(state => ({ records: [record, ...state.records] }))
        return record
      },

      claimPrize: (recordId) => {
        set(state => ({
          records: state.records.map(r =>
            r.id === recordId ? { ...r, claimed: true } : r
          ),
        }))
      },

      getRecordsByUser: (userId) =>
        get().records.filter(r => r.userId === userId),

      getStatsByCategory: (userId) => {
        const records = userId
          ? get().records.filter(r => r.userId === userId)
          : get().records
        const stats: Record<PrizeCategory, number> = {
          snack: 0, fruit: 0, cash: 0,
          privilege: 0, romantic: 0,
        }
        records.forEach(r => { stats[r.prizeCategory]++ })
        return stats
      },

      clearRecords: () => set({ records: [] }),

      getTotalDraws: (userId) => {
        const records = userId
          ? get().records.filter(r => r.userId === userId)
          : get().records
        return records.length
      },
    }),
    { name: 'forus-lottery', version: 1 }
  )
)
