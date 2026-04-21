import { create } from 'zustand'
import type { Prize, PrizeCategory } from '../types'

const defaultPrizes: Prize[] = [
  { id: 1,  name: '奶茶 1 杯',        category: 'snack', emoji: '🧋' },
  { id: 2,  name: '薯片 1 包',        category: 'snack', emoji: '🍟' },
  { id: 3,  name: '冰淇淋 1 个',      category: 'snack', emoji: '🍦' },
  { id: 4,  name: '饼干 1 包',        category: 'snack', emoji: '🍪' },
  { id: 5,  name: '果冻 1 盒',        category: 'snack', emoji: '🍮' },
  { id: 6,  name: '泡芙 1 盒',        category: 'snack', emoji: '🥐' },
  { id: 7,  name: '布丁 1 个',        category: 'snack', emoji: '🍮' },
  { id: 8,  name: '坚果 1 包',        category: 'snack', emoji: '🥜' },
  { id: 9,  name: '肉干 1 包',        category: 'snack', emoji: '🥩' },
  { id: 10, name: '海苔 1 包',        category: 'snack', emoji: '🌿' },
  { id: 11, name: '小蛋糕 1 个',      category: 'snack', emoji: '🎂' },
  { id: 12, name: '火锅卷',           category: 'snack', emoji: '🍲' },
  { id: 13, name: '虎皮鸡爪',         category: 'snack', emoji: '🍗' },
  { id: 14, name: '泡面',             category: 'snack', emoji: '🍜' },
  { id: 15, name: '任意卷',           category: 'snack', emoji: '🛍️' },
  { id: 21, name: '水果拼盘',         category: 'fruit', emoji: '🍱' },
  { id: 22, name: '任意水果卷',       category: 'fruit', emoji: '🎫' },
  { id: 23, name: '水果沙拉',         category: 'fruit', emoji: '🥗' },
  { id: 36, name: '¥0.52 — 吾爱',           category: 'cash', emoji: '💌' },
  { id: 37, name: '¥0.99 — 久久',           category: 'cash', emoji: '💴' },
  { id: 38, name: '¥1.31 — 一生一世（简）', category: 'cash', emoji: '💴' },
  { id: 39, name: '¥1.99 — 要久久',         category: 'cash', emoji: '💴' },
  { id: 40, name: '¥2.58 — 爱我吧',         category: 'cash', emoji: '💴' },
  { id: 41, name: '¥3.14 — 派',             category: 'cash', emoji: '💴' },
  { id: 42, name: '¥3.44 — 想死你',         category: 'cash', emoji: '💴' },
  { id: 43, name: '¥4.56 — 是我啦',         category: 'cash', emoji: '💴' },
  { id: 44, name: '¥5.20 — 我爱你',         category: 'cash', emoji: '💝' },
  { id: 45, name: '¥5.21 — 我愿意',         category: 'cash', emoji: '💝' },
  { id: 46, name: '¥6.66 — 顺顺顺',         category: 'cash', emoji: '💴' },
  { id: 47, name: '¥7.21 — 亲爱的',         category: 'cash', emoji: '💴' },
  { id: 48, name: '¥7.77 — 亲亲亲',         category: 'cash', emoji: '💴' },
  { id: 49, name: '¥8.88 — 发发发',         category: 'cash', emoji: '💴' },
  { id: 50, name: '¥9.99 — 长长久久',       category: 'cash', emoji: '💝' },
  { id: 51, name: '¥10.24 — 程序员节',      category: 'cash', emoji: '💻' },
  { id: 52, name: '¥11.11 — 一心一意',      category: 'cash', emoji: '💝' },
  { id: 53, name: '¥12.12 — 要爱要爱',      category: 'cash', emoji: '💴' },
  { id: 54, name: '¥13.14 — 一生一世',      category: 'cash', emoji: '💝' },
  { id: 55, name: '¥15.21 — 一定我爱你',    category: 'cash', emoji: '💝' },
  { id: 56, name: '¥16.88 — 一路发发',      category: 'cash', emoji: '💴' },
  { id: 57, name: '¥17.21 — 一起爱你',      category: 'cash', emoji: '💴' },
  { id: 58, name: '¥18.88 — 要发发发',      category: 'cash', emoji: '💴' },
  { id: 59, name: '¥19.99 — 要久久久',      category: 'cash', emoji: '💴' },
  { id: 60, name: '¥20.00 — 爱你满分',      category: 'cash', emoji: '💝' },
  { id: 64, name: '任性购物券（50元内）',   category: 'privilege', emoji: '🛍️' },
  { id: 65, name: '一场电影',               category: 'privilege', emoji: '🎬' },
  { id: 66, name: '一顿大餐',               category: 'privilege', emoji: '🍷' },
  { id: 67, name: '听话卷',                 category: 'privilege', emoji: '👂' },
  { id: 68, name: '挑战卷',                 category: 'privilege', emoji: '⚡' },
  { id: 91, name: '一个大大的拥抱',         category: 'romantic', emoji: '🤗' },
  { id: 92, name: '按摩 15 分钟',           category: 'romantic', emoji: '💆' },
  { id: 93, name: '今日无限亲亲',           category: 'romantic', emoji: '💋' },
  { id: 94, name: 'ss卷',                   category: 'romantic', emoji: '💕' },
  { id: 95, name: '指定知识卷',             category: 'romantic', emoji: '📚' },
  { id: 96, name: '挑战卷',                 category: 'romantic', emoji: '⚡' },
  { id: 97, name: 'fj卷',                   category: 'romantic', emoji: '✨' },
  { id: 98, name: 'xj卷',                   category: 'romantic', emoji: '🌸' },
]

interface PrizeStore {
  prizes: Prize[]
  addPrize: (name: string, category: PrizeCategory, emoji: string) => void
  updatePrize: (id: number, data: Partial<Omit<Prize, 'id'>>) => void
  deletePrize: (id: number) => void
}

export const usePrizeStore = create<PrizeStore>()(
  (set, get) => ({
      prizes: defaultPrizes,

      addPrize: (name, category, emoji) => {
        const maxId = Math.max(...get().prizes.map(p => p.id), 100)
        set(state => ({
          prizes: [...state.prizes, { id: maxId + 1, name, category, emoji }],
        }))
      },

      updatePrize: (id, data) => {
        set(state => ({
          prizes: state.prizes.map(p => p.id === id ? { ...p, ...data } : p),
        }))
      },

      deletePrize: (id) => {
        set(state => ({ prizes: state.prizes.filter(p => p.id !== id) }))
      },
  })
)
