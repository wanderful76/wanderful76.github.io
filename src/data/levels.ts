export interface CoupleLevel {
  level: number
  name: string
  emoji: string
  description: string
  minTasks: number
  color: string
  bgColor: string
}

export const coupleLevels: CoupleLevel[] = [
  { level: 1,  name: '初见心动',  emoji: '🌱', description: '爱的种子悄悄发芽',      minTasks: 0,   color: 'text-green-600',  bgColor: 'bg-green-50'   },
  { level: 2,  name: '甜蜜相伴',  emoji: '🌿', description: '两人携手，慢慢生长',    minTasks: 10,  color: 'text-teal-600',   bgColor: 'bg-teal-50'    },
  { level: 3,  name: '默契十足',  emoji: '🌸', description: '心意相通，花朵初放',    minTasks: 25,  color: 'text-pink-600',   bgColor: 'bg-pink-50'    },
  { level: 4,  name: '爱意满满',  emoji: '🌺', description: '浓情蜜意，繁花似锦',    minTasks: 50,  color: 'text-rose-600',   bgColor: 'bg-rose-50'    },
  { level: 5,  name: '携手共进',  emoji: '🍀', description: '同心同德，步步生辉',    minTasks: 80,  color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  { level: 6,  name: '情深意厚',  emoji: '✨', description: '情如星辰，熠熠闪光',    minTasks: 120, color: 'text-amber-600',  bgColor: 'bg-amber-50'   },
  { level: 7,  name: '白头偕老',  emoji: '💫', description: '岁月沉淀，历久弥香',    minTasks: 180, color: 'text-purple-600', bgColor: 'bg-purple-50'  },
  { level: 8,  name: '天作之合',  emoji: '💖', description: '天地见证，爱已永恒',    minTasks: 250, color: 'text-red-600',    bgColor: 'bg-red-50'     },
]

export function getCurrentLevel(totalTasks: number): CoupleLevel {
  let current = coupleLevels[0]
  for (const lvl of coupleLevels) {
    if (totalTasks >= lvl.minTasks) current = lvl
    else break
  }
  return current
}

export function getNextLevel(totalTasks: number): CoupleLevel | null {
  const cur = getCurrentLevel(totalTasks)
  return coupleLevels.find(l => l.level === cur.level + 1) ?? null
}

export function getLevelProgress(totalTasks: number): number {
  const cur = getCurrentLevel(totalTasks)
  const next = getNextLevel(totalTasks)
  if (!next) return 100
  return Math.round(((totalTasks - cur.minTasks) / (next.minTasks - cur.minTasks)) * 100)
}
