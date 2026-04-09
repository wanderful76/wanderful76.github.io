export interface Achievement {
  id: string
  emoji: string
  title: string
  desc: string
  quote: string
  imageFile: string
  check: (tasks: number, streak: number, draws: number) => boolean
}

export const achievements: Achievement[] = [
  // ── 任务里程碑 ──────────────────────────────────────────────────
  {
    id: 'first_task', emoji: '🌱', title: '万事开头难',
    desc: '完成第一个任务',
    quote: '千里之行，始于足下。——《道德经》',
    imageFile: 'badge-first_task.png',
    check: (n) => n >= 1,
  },
  {
    id: 'five_tasks', emoji: '🦋', title: '初露锋芒',
    desc: '累计完成 5 个任务',
    quote: '不积跬步，无以至千里。继续加油！',
    imageFile: 'badge-five_tasks.png',
    check: (n) => n >= 5,
  },
  {
    id: 'ten_tasks', emoji: '⭐', title: '勤奋学者',
    desc: '累计完成 10 个任务',
    quote: '学如逆水行舟，不进则退。你们做到了！',
    imageFile: 'badge-ten_tasks.png',
    check: (n) => n >= 10,
  },
  {
    id: 'twenty_tasks', emoji: '📚', title: '习惯养成',
    desc: '累计完成 20 个任务',
    quote: '行是知之始，知是行之成。习惯已悄然生根。',
    imageFile: 'badge-twenty_tasks.png',
    check: (n) => n >= 20,
  },
  {
    id: 'thirty_tasks', emoji: '🎯', title: '专注前行',
    desc: '累计完成 30 个任务',
    quote: '宝剑锋从磨砺出，梅花香自苦寒来。',
    imageFile: 'badge-thirty_tasks.png',
    check: (n) => n >= 30,
  },
  {
    id: 'fifty_tasks', emoji: '🏆', title: '任务达人',
    desc: '累计完成 50 个任务',
    quote: '志之所趋，无远弗届。五十步，仍是好的开始。',
    imageFile: 'badge-fifty_tasks.png',
    check: (n) => n >= 50,
  },
  {
    id: 'seventy_tasks', emoji: '👑', title: '执着王者',
    desc: '累计完成 75 个任务',
    quote: '合抱之木，生于毫末；九层之台，起于垒土。',
    imageFile: 'badge-seventy_tasks.png',
    check: (n) => n >= 75,
  },
  {
    id: 'hundred_tasks', emoji: '🌟', title: '百战百胜',
    desc: '累计完成 100 个任务',
    quote: '路漫漫其修远兮，吾将上下而求索。百个任务，不是终点。',
    imageFile: 'badge-hundred_tasks.png',
    check: (n) => n >= 100,
  },

  // ── 连续天数 ──────────────────────────────────────────────────
  {
    id: 'streak_3', emoji: '🔥', title: '初心不改',
    desc: '连续完成任务 3 天',
    quote: '三日打鱼，两日晒网？你们没有！',
    imageFile: 'badge-streak_3.png',
    check: (_, s) => s >= 3,
  },
  {
    id: 'streak_7', emoji: '💎', title: '一周不间断',
    desc: '连续完成任务 7 天',
    quote: '七日来复，天心不息。你们真的很棒！',
    imageFile: 'badge-streak_7.png',
    check: (_, s) => s >= 7,
  },
  {
    id: 'streak_14', emoji: '🌙', title: '持之以恒',
    desc: '连续完成任务 14 天',
    quote: '锲而不舍，金石可镂。两周的坚持值得骄傲。',
    imageFile: 'badge-streak_14.png',
    check: (_, s) => s >= 14,
  },
  {
    id: 'streak_30', emoji: '☀️', title: '一月坚持',
    desc: '连续完成任务 30 天',
    quote: '滴水穿石，非一日之功。一个月，你们做到了！',
    imageFile: 'badge-streak_30.png',
    check: (_, s) => s >= 30,
  },
  {
    id: 'streak_60', emoji: '🌠', title: '两月相随',
    desc: '连续完成任务 60 天',
    quote: '两情若是久长时，又岂在朝朝暮暮。——秦观',
    imageFile: 'badge-streak_60.png',
    check: (_, s) => s >= 60,
  },

  // ── 抽奖里程碑 ──────────────────────────────────────────────────
  {
    id: 'first_draw', emoji: '🎁', title: '第一个惊喜',
    desc: '进行第一次抽奖',
    quote: '惊喜是最好的礼物，期待下一次！',
    imageFile: 'badge-first_draw.png',
    check: (_, __, d) => d >= 1,
  },
  {
    id: 'five_draws', emoji: '🎊', title: '满心期待',
    desc: '累计抽奖 5 次',
    quote: '每一次期待都是一颗小星星，闪闪发光。',
    imageFile: 'badge-five_draws.png',
    check: (_, __, d) => d >= 5,
  },
  {
    id: 'ten_draws', emoji: '🎰', title: '抽奖爱好者',
    desc: '累计抽奖 10 次',
    quote: '命运的齿轮开始转动，你们是彼此的幸运。',
    imageFile: 'badge-ten_draws.png',
    check: (_, __, d) => d >= 10,
  },
  {
    id: 'twenty_draws', emoji: '🃏', title: '命中注定',
    desc: '累计抽奖 20 次',
    quote: '问世间情为何物，直教生死相许。——元好问',
    imageFile: 'badge-twenty_draws.png',
    check: (_, __, d) => d >= 20,
  },

  // ── 爱情主题（综合条件）────────────────────────────────────────
  {
    id: 'love_start', emoji: '💕', title: '爱的起点',
    desc: '完成 2 个任务并抽过 1 次奖',
    quote: '愿得一心人，白头不相离。——卓文君',
    imageFile: 'badge-love_start.png',
    check: (n, _, d) => n >= 2 && d >= 1,
  },
  {
    id: 'love_bloom', emoji: '🌸', title: '花好月圆',
    desc: '连续 10 天 + 累计抽奖 3 次',
    quote: '桃之夭夭，灼灼其华。之子于归，宜其室家。——《诗经》',
    imageFile: 'badge-love_bloom.png',
    check: (_, s, d) => s >= 10 && d >= 3,
  },
  {
    id: 'love_deep', emoji: '🌹', title: '情深似海',
    desc: '累计完成 40 个任务 + 抽奖 5 次',
    quote: '曾经沧海难为水，除却巫山不是云。——元稹',
    imageFile: 'badge-love_deep.png',
    check: (n, _, d) => n >= 40 && d >= 5,
  },
  {
    id: 'love_eternity', emoji: '💖', title: '相爱相守',
    desc: '累计完成 20 个任务 + 连续 5 天',
    quote: '执子之手，与子偕老。——《诗经·击鼓》',
    imageFile: 'badge-love_eternity.png',
    check: (n, s) => n >= 20 && s >= 5,
  },
  {
    id: 'dedication', emoji: '🤝', title: '并肩前行',
    desc: '累计完成 30 个任务 + 连续 7 天',
    quote: '在天愿作比翼鸟，在地愿为连理枝。——白居易',
    imageFile: 'badge-dedication.png',
    check: (n, s) => n >= 30 && s >= 7,
  },

  // ── 特殊成就 ────────────────────────────────────────────────────
  {
    id: 'lucky_star', emoji: '🍀', title: '幸运降临',
    desc: '累计抽奖 15 次',
    quote: '众里寻他千百度，蓦然回首，那人却在灯火阑珊处。——辛弃疾',
    imageFile: 'badge-lucky_star.png',
    check: (_, __, d) => d >= 15,
  },
  {
    id: 'unstoppable', emoji: '💫', title: '星途漫漫',
    desc: '连续完成任务 21 天',
    quote: '但愿人长久，千里共婵娟。——苏轼',
    imageFile: 'badge-unstoppable.png',
    check: (_, s) => s >= 21,
  },
  {
    id: 'legend', emoji: '🏅', title: '传说级别',
    desc: '完成 100 个任务 + 连续 14 天 + 抽奖 10 次',
    quote: '两情若是久长时，又岂在朝朝暮暮。此刻，你们是彼此的传说。',
    imageFile: 'badge-legend.png',
    check: (n, s, d) => n >= 100 && s >= 14 && d >= 10,
  },
]

export const BADGE_IMAGES_PATH = '/badges/'
