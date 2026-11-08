export type CourseDay = {
  day: number;
  unit: string;
  title: string;
  phonemeIds: string[];
  focus: string;
  tip: string;
};

export const COURSE: CourseDay[] = [
  {
    day: 1,
    unit: "单元音 · 前",
    title: "长短 i",
    phonemeIds: ["iː", "ɪ"],
    focus: "长度与松紧",
    tip: "sheep 要拉长、嘴角拉开；ship 又短又松。这是最常见的一对中式口音。",
  },
  {
    day: 2,
    unit: "单元音 · 前",
    title: "开口 e / æ",
    phonemeIds: ["e", "æ"],
    focus: "开口大小",
    tip: "bed 嘴中开，bad 要看见牙齿。张口不够，cat 就会被听成 ket。",
  },
  {
    day: 3,
    unit: "单元音 · 中",
    title: "中央 ə / ɜː",
    phonemeIds: ["ə", "ɜː"],
    focus: "弱读与重读",
    tip: "ə 是英语里最懒的音，只出现在弱读。ɜː 要拉长，舌头别卷。",
  },
  {
    day: 4,
    unit: "单元音 · 中后",
    title: "短 ʌ 与长 ɑː",
    phonemeIds: ["ʌ", "ɑː"],
    focus: "短促 vs 开口长音",
    tip: "cut 短而靠前，cart 长而靠后。倒 V 像一顶帽子，盖住短音。",
  },
  {
    day: 5,
    unit: "单元音 · 后",
    title: "圆唇 ɒ / ɔː",
    phonemeIds: ["ɒ", "ɔː"],
    focus: "短开 vs 长合",
    tip: "hot 口开、音短；hall 唇更圆、音更长。这是英式 DJ 的标志对比。",
  },
  {
    day: 6,
    unit: "单元音 · 后",
    title: "长短 u",
    phonemeIds: ["ʊ", "uː"],
    focus: "圆唇松紧",
    tip: "full 松而短，fool 圆而长。发 /uː/ 时把嘴唇收成吸管。",
  },
  {
    day: 7,
    unit: "双元音 · 合口",
    title: "eɪ 与 aɪ",
    phonemeIds: ["eɪ", "aɪ"],
    focus: "滑动到 ɪ",
    tip: "双元音一定要滑。day 从 e 滑到 ɪ，my 从大开口 a 滑到 ɪ。",
  },
  {
    day: 8,
    unit: "双元音 · 合口",
    title: "ɔɪ 与 əʊ",
    phonemeIds: ["ɔɪ", "əʊ"],
    focus: "圆唇起点与英式 o",
    tip: "boy 先圆后扁。go 在 DJ 里写作 /əʊ/，不是美式 /oʊ/。",
  },
  {
    day: 9,
    unit: "双元音",
    title: "aʊ 与 ɪə",
    phonemeIds: ["aʊ", "ɪə"],
    focus: "开口滑向 u，集中到 ə",
    tip: "now 口先大开。here 从 ɪ 落到 ə，英式不卷舌。",
  },
  {
    day: 10,
    unit: "双元音 · 集中",
    title: "eə 与 ʊə",
    phonemeIds: ["eə", "ʊə"],
    focus: "落到 schwa",
    tip: "hair 是 e 落到 ə。tour 的传统 DJ 是 ʊə，现代口音常并入 ɔː。",
  },
  {
    day: 11,
    unit: "辅音 · 爆破",
    title: "双唇 p / b",
    phonemeIds: ["p", "b"],
    focus: "清浊与送气",
    tip: "词尾不要加元音。摸喉结：b 振动，p 不振动。",
  },
  {
    day: 12,
    unit: "辅音 · 爆破",
    title: "齿龈 t / d",
    phonemeIds: ["t", "d"],
    focus: "舌尖位置",
    tip: "舌尖抵上齿龈，不要抵牙齿。词尾 t / d 不要吞掉。",
  },
  {
    day: 13,
    unit: "辅音 · 爆破",
    title: "软腭 k / g",
    phonemeIds: ["k", "g"],
    focus: "舌后抵腭",
    tip: "c、k、ck、ch 都可能是 /k/。词尾 g 不要发成 k。",
  },
  {
    day: 14,
    unit: "辅音 · 摩擦",
    title: "唇齿 f / v",
    phonemeIds: ["f", "v"],
    focus: "咬唇",
    tip: "very 不是 wery。上齿必须轻咬下唇，v 还要让声带振动。",
  },
  {
    day: 15,
    unit: "辅音 · 摩擦",
    title: "齿间 θ / ð",
    phonemeIds: ["θ", "ð"],
    focus: "伸舌",
    tip: "think 不是 sink，this 不是 zis。舌尖轻轻露出齿间。",
  },
  {
    day: 16,
    unit: "辅音 · 摩擦",
    title: "齿龈 s / z",
    phonemeIds: ["s", "z"],
    focus: "清浊摩擦",
    tip: "词尾 -s 在浊音后读 /z/：dogs、is、please。",
  },
  {
    day: 17,
    unit: "辅音 · 摩擦",
    title: "后齿龈 ʃ / ʒ",
    phonemeIds: ["ʃ", "ʒ"],
    focus: "圆唇摩擦",
    tip: "she 像让人安静的「嘘」。ʒ 较少见，usually、television 里的那一截。",
  },
  {
    day: 18,
    unit: "辅音",
    title: "h 与 tʃ",
    phonemeIds: ["h", "tʃ"],
    focus: "呵气与破擦",
    tip: "h 只是呵气，不要读成汉语「喝」。chair 是一个音，不是 t + sh。",
  },
  {
    day: 19,
    unit: "辅音 · 破擦",
    title: "dʒ 与 ts",
    phonemeIds: ["dʒ", "ts"],
    focus: "DJ 破擦音",
    tip: "job 是 /dʒ/ 不是 /j/。ts 多出现在复数 cats、its。",
  },
  {
    day: 20,
    unit: "辅音 · 破擦",
    title: "dz 与 tr",
    phonemeIds: ["dz", "tr"],
    focus: "浊复数与 tr 连读",
    tip: "beds 读 dz。tree 不要拆成 te-ree。",
  },
  {
    day: 21,
    unit: "辅音",
    title: "dr 与 m",
    phonemeIds: ["dr", "m"],
    focus: "浊连读与鼻音",
    tip: "dream 与 tree 口型相近，但要带声。m 的词尾必须闭唇。",
  },
  {
    day: 22,
    unit: "辅音 · 鼻音",
    title: "n 与 ŋ",
    phonemeIds: ["n", "ŋ"],
    focus: "舌尖 vs 舌根",
    tip: "sin 用舌尖，sing 用舌根。ŋ 后面不要再加 /g/。",
  },
  {
    day: 23,
    unit: "辅音 · 近音",
    title: "l 与 r",
    phonemeIds: ["l", "r"],
    focus: "接触 vs 接近",
    tip: "l 舌尖抵住；r 接近但不贴死。英式词尾 r 通常不发音。",
  },
  {
    day: 24,
    unit: "辅音 · 近音",
    title: "w 与 j",
    phonemeIds: ["w", "j"],
    focus: "滑向元音",
    tip: "w 圆唇不咬唇，wine 不是 vine。音标 /j/ 读 y，yes 不是 jes。",
  },
];

export const COURSE_LENGTH = COURSE.length;

export function getDay(day: number): CourseDay | undefined {
  return COURSE.find((d) => d.day === day);
}

export function nextIncompleteDay(completed: Record<number, unknown>): number {
  for (let d = 1; d <= COURSE_LENGTH; d++) {
    if (!completed[d]) return d;
  }
  return COURSE_LENGTH;
}

export function isDayUnlocked(day: number, completed: Record<number, unknown>): boolean {
  if (day <= 1) return true;
  if (day > COURSE_LENGTH) return false;
  return Boolean(completed[day - 1]);
}

export const UNITS: { id: string; label: string; days: number[] }[] = [
  { id: "mono", label: "单元音", days: [1, 2, 3, 4, 5, 6] },
  { id: "di", label: "双元音", days: [7, 8, 9, 10] },
  { id: "cons", label: "辅音", days: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
];
