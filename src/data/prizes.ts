import type { Prize } from '../types'

export const prizes: Prize[] = [
  // 🍬 零食类 (15) — 严格按文档
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
  { id: 14, name: '泡面',             category: 'snack', emoji: '�' },
  { id: 15, name: '任意卷',           category: 'snack', emoji: '🛍️' },

  // 🍎 水果类 (3) — 严格按文档
  { id: 21, name: '水果拼盘',         category: 'fruit', emoji: '🍱' },
  { id: 22, name: '任意水果卷',       category: 'fruit', emoji: '🎫' },
  { id: 23, name: '水果沙拉',         category: 'fruit', emoji: '🥗' },

  // 💰 现金红包 (25) — 严格按文档
  { id: 36, name: '¥0.52 — 吾爱',          category: 'cash', emoji: '💌', description: '0.52 → 吾爱' },
  { id: 37, name: '¥0.99 — 久久',          category: 'cash', emoji: '💴', description: '0.99 → 久久' },
  { id: 38, name: '¥1.31 — 一生一世（简）',category: 'cash', emoji: '💴', description: '1.31 → 一生一世' },
  { id: 39, name: '¥1.99 — 要久久',        category: 'cash', emoji: '💴', description: '1.99 → 要久久' },
  { id: 40, name: '¥2.58 — 爱我吧',        category: 'cash', emoji: '💴', description: '2.58 → 爱我吧' },
  { id: 41, name: '¥3.14 — 派',            category: 'cash', emoji: '💴', description: '3.14 → 数学的浪漫' },
  { id: 42, name: '¥3.44 — 想死你',        category: 'cash', emoji: '💴', description: '3.44 → 想死你' },
  { id: 43, name: '¥4.56 — 是我啦',        category: 'cash', emoji: '💴', description: '4.56 → 是我啦' },
  { id: 44, name: '¥5.20 — 我爱你',        category: 'cash', emoji: '💝', description: '5.20 → 我爱你' },
  { id: 45, name: '¥5.21 — 我愿意',        category: 'cash', emoji: '💝', description: '5.21 → 我愿意' },
  { id: 46, name: '¥6.66 — 顺顺顺',        category: 'cash', emoji: '💴', description: '6.66 → 顺顺顺' },
  { id: 47, name: '¥7.21 — 亲爱的',        category: 'cash', emoji: '💴', description: '7.21 → 亲爱的' },
  { id: 48, name: '¥7.77 — 亲亲亲',        category: 'cash', emoji: '💴', description: '7.77 → 亲亲亲' },
  { id: 49, name: '¥8.88 — 发发发',        category: 'cash', emoji: '💴', description: '8.88 → 发发发' },
  { id: 50, name: '¥9.99 — 长长久久',      category: 'cash', emoji: '💝', description: '9.99 → 长长久久' },
  { id: 51, name: '¥10.24 — 程序员节',     category: 'cash', emoji: '💻', description: '10.24 → 程序员节' },
  { id: 52, name: '¥11.11 — 一心一意',     category: 'cash', emoji: '💝', description: '11.11 → 一心一意' },
  { id: 53, name: '¥12.12 — 要爱要爱',     category: 'cash', emoji: '💴', description: '12.12 → 要爱要爱' },
  { id: 54, name: '¥13.14 — 一生一世',     category: 'cash', emoji: '💝', description: '13.14 → 一生一世' },
  { id: 55, name: '¥15.21 — 一定我爱你',   category: 'cash', emoji: '💝', description: '15.21 → 一定我爱你' },
  { id: 56, name: '¥16.88 — 一路发发',     category: 'cash', emoji: '💴', description: '16.88 → 一路发发' },
  { id: 57, name: '¥17.21 — 一起爱你',     category: 'cash', emoji: '💴', description: '17.21 → 一起爱你' },
  { id: 58, name: '¥18.88 — 要发发发',     category: 'cash', emoji: '💴', description: '18.88 → 要发发发' },
  { id: 59, name: '¥19.99 — 要久久久',     category: 'cash', emoji: '💴', description: '19.99 → 要久久久' },
  { id: 60, name: '¥20.00 — 爱你满分',     category: 'cash', emoji: '💝', description: '20.00 → 爱你满分' },

  // 🎮 特权奖励 (5) — 严格按文档
  { id: 64, name: '任性购物券（50元内）',  category: 'privilege', emoji: '🛍️' },
  { id: 65, name: '一场电影',              category: 'privilege', emoji: '🎬' },
  { id: 66, name: '一顿大餐',              category: 'privilege', emoji: '🍷' },
  { id: 67, name: '听话卷',               category: 'privilege', emoji: '👂' },
  { id: 68, name: '挑战卷',               category: 'privilege', emoji: '⚡' },

  //  浪漫奖励 (8) — 严格按文档
  { id: 91, name: '一个大大的拥抱',        category: 'romantic', emoji: '🤗' },
  { id: 92, name: '按摩 15 分钟',          category: 'romantic', emoji: '💆' },
  { id: 93, name: '今日无限亲亲',          category: 'romantic', emoji: '💋' },
  { id: 94, name: 'ss卷',                  category: 'romantic', emoji: '💕' },
  { id: 95, name: '指定知识卷',            category: 'romantic', emoji: '📚' },
  { id: 96, name: '挑战卷',               category: 'romantic', emoji: '⚡' },
  { id: 97, name: 'fj卷',                  category: 'romantic', emoji: '✨' },
  { id: 98, name: 'xj卷',                  category: 'romantic', emoji: '🌸' },
]

export const prizeCategoryConfig: Record<string, { label: string; color: string; bg: string }> = {
  snack:     { label: '零食奖励', color: 'text-orange-600', bg: 'bg-orange-100' },
  fruit:     { label: '水果奖励', color: 'text-green-600',  bg: 'bg-green-100'  },
  cash:      { label: '现金红包', color: 'text-yellow-600', bg: 'bg-yellow-100' },
  privilege: { label: '特权奖励', color: 'text-blue-600',   bg: 'bg-blue-100'   },
  romantic:  { label: '浪漫奖励', color: 'text-rose-600',   bg: 'bg-rose-100'   },
}
