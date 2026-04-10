import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishItem, WishCategory } from '../types'

interface WishStore {
  wishes: WishItem[]
  addWish: (title: string, note: string, category: WishCategory, userId: string) => void
  fulfillWish: (id: string, userId: string) => void
  deleteWish: (id: string) => void
  clearAll: () => void
}

export const useWishStore = create<WishStore>()(
  persist(
    (set) => ({
      wishes: [],

      addWish: (title, note, category, userId) => {
        const item: WishItem = {
          id: `wish-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          title,
          note: note || undefined,
          category,
          addedBy: userId,
          addedAt: new Date().toISOString(),
          fulfilled: false,
        }
        set(state => ({ wishes: [item, ...state.wishes] }))
      },

      fulfillWish: (id, userId) => {
        set(state => ({
          wishes: state.wishes.map(w =>
            w.id === id
              ? { ...w, fulfilled: true, fulfilledAt: new Date().toISOString(), fulfilledBy: userId }
              : w
          ),
        }))
      },

      deleteWish: (id) => {
        set(state => ({ wishes: state.wishes.filter(w => w.id !== id) }))
      },

      clearAll: () => set({ wishes: [] }),
    }),
    { name: 'forus-wishes-local' }
  )
)
