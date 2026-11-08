import { COURSE } from "./curriculum";
import { getPhoneme, PHONEMES, type Phoneme } from "./phonemes";

export type QuizOption = {
  id: string;
  label: string;
  sub?: string;
};

export type QuizQuestion = {
  id: string;
  type: "identify" | "name" | "example" | "memory" | "listen" | "contrast";
  prompt: string;
  hint?: string;
  playWord?: string;
  options: QuizOption[];
  answerId: string;
  phonemeId: string;
};

const LOOKALIKES: Record<string, string[]> = {
  "iː": ["ɪ", "e", "j"],
  ɪ: ["iː", "e", "ə"],
  e: ["æ", "ɪ", "eɪ"],
  æ: ["e", "ʌ", "ɑː"],
  ə: ["ɜː", "ʌ", "e"],
  "ɜː": ["ə", "eə", "ɔː"],
  ʌ: ["ɑː", "æ", "ə"],
  "ɑː": ["ʌ", "ɒ", "æ"],
  ɒ: ["ɔː", "ɑː", "ʌ"],
  "ɔː": ["ɒ", "əʊ", "ɑː"],
  ʊ: ["uː", "ə", "ʌ"],
  "uː": ["ʊ", "w", "ɔː"],
  eɪ: ["e", "aɪ", "ɪ"],
  aɪ: ["eɪ", "aʊ", "ɪ"],
  ɔɪ: ["ɔː", "aɪ", "ɪ"],
  əʊ: ["ɔː", "aʊ", "ə"],
  aʊ: ["aɪ", "əʊ", "ɑː"],
  ɪə: ["eə", "ɪ", "ə"],
  eə: ["ɪə", "eɪ", "e"],
  ʊə: ["ʊ", "ɔː", "ə"],
  p: ["b", "t", "f"],
  b: ["p", "d", "v"],
  t: ["d", "k", "θ"],
  d: ["t", "b", "ð"],
  k: ["g", "t", "h"],
  g: ["k", "d", "ŋ"],
  f: ["v", "θ", "p"],
  v: ["f", "w", "b"],
  θ: ["ð", "s", "f"],
  ð: ["θ", "z", "d"],
  s: ["z", "ʃ", "θ"],
  z: ["s", "ʒ", "ð"],
  ʃ: ["s", "tʃ", "ʒ"],
  ʒ: ["ʃ", "z", "dʒ"],
  h: ["f", "k", "w"],
  tʃ: ["ʃ", "dʒ", "tr"],
  dʒ: ["tʃ", "ʒ", "j"],
  ts: ["dz", "tʃ", "s"],
  dz: ["ts", "dʒ", "z"],
  tr: ["dr", "tʃ", "t"],
  dr: ["tr", "dʒ", "d"],
  m: ["n", "ŋ", "b"],
  n: ["ŋ", "m", "l"],
  ŋ: ["n", "g", "m"],
  l: ["r", "n", "w"],
  r: ["l", "w", "ʒ"],
  w: ["v", "r", "uː"],
  j: ["dʒ", "ɪ", "iː"],
};

function shuffle<T>(list: T[]): T[] {
  const next = [...list];
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = next[i]!;
    next[i] = next[j]!;
    next[j] = tmp;
  }
  return next;
}

function uniquePhonemes(ids: string[]): Phoneme[] {
  const seen = new Set<string>();
  const out: Phoneme[] = [];
  for (const id of ids) {
    if (seen.has(id)) continue;
    const p = getPhoneme(id);
    if (!p) continue;
    seen.add(id);
    out.push(p);
  }
  return out;
}

export function distractorsFor(phoneme: Phoneme, count = 3): Phoneme[] {
  const ids = [
    ...(LOOKALIKES[phoneme.id] ?? []),
    phoneme.contrast?.with ?? "",
    ...PHONEMES.filter((p) => p.groupZh === phoneme.groupZh && p.id !== phoneme.id).map((p) => p.id),
    ...PHONEMES.filter((p) => p.kind === phoneme.kind && p.id !== phoneme.id).map((p) => p.id),
  ];
  return uniquePhonemes(ids.filter(Boolean)).slice(0, count);
}

function optionsFrom(correct: Phoneme, extra: Phoneme[]): QuizOption[] {
  const pool = uniquePhonemes([correct.id, ...extra.map((p) => p.id)]).slice(0, 4);
  while (pool.length < 4) {
    const fallback = PHONEMES[Math.floor(Math.random() * PHONEMES.length)]!;
    if (!pool.some((p) => p.id === fallback.id)) pool.push(fallback);
  }
  return shuffle(
    pool.map((p) => ({
      id: p.id,
      label: `/${p.ipa}/`,
      sub: p.nameZh,
    })),
  );
}

function identifyQuestion(phoneme: Phoneme): QuizQuestion {
  return {
    id: `identify-${phoneme.id}`,
    type: "identify",
    prompt: `哪一个是「${phoneme.nameZh}」？`,
    hint: phoneme.writing.similarTo,
    options: optionsFrom(phoneme, distractorsFor(phoneme)),
    answerId: phoneme.id,
    phonemeId: phoneme.id,
  };
}

function nameQuestion(phoneme: Phoneme): QuizQuestion {
  const others = distractorsFor(phoneme);
  const opts = shuffle(
    uniquePhonemes([phoneme.id, ...others.map((p) => p.id)])
      .slice(0, 4)
      .map((p) => ({ id: p.id, label: p.nameZh, sub: `/${p.ipa}/` })),
  );
  return {
    id: `name-${phoneme.id}`,
    type: "name",
    prompt: `/${phoneme.ipa}/ 的名称是？`,
    options: opts,
    answerId: phoneme.id,
    phonemeId: phoneme.id,
  };
}

function exampleQuestion(phoneme: Phoneme): QuizQuestion {
  const word = phoneme.examples[0]!;
  const others = distractorsFor(phoneme, 3);
  const opts = shuffle(
    [
      { id: phoneme.id, label: `/${phoneme.ipa}/`, sub: phoneme.nameZh },
      ...others.slice(0, 3).map((p) => ({ id: p.id, label: `/${p.ipa}/`, sub: p.nameZh })),
    ].slice(0, 4),
  );
  return {
    id: `example-${phoneme.id}-${word.word}`,
    type: "example",
    prompt: `单词 ${word.word} 里画线的音是？`,
    hint: `${word.word} /${word.ipa}/　${word.zh}`,
    options: opts,
    answerId: phoneme.id,
    phonemeId: phoneme.id,
  };
}

function memoryQuestion(phoneme: Phoneme): QuizQuestion {
  const trap = phoneme.memory.pitfall;
  const others = [
    "要把舌头卷起来才算地道。",
    "词尾必须再加一个元音才听得清。",
    "这个音和汉语拼音完全一一对应。",
    "只要写对字母，口型可以随便。",
  ].filter((line) => line !== trap);
  const options = shuffle([
    { id: "true", label: trap },
    { id: "d1", label: others[0]! },
    { id: "d2", label: others[1]! },
    { id: "d3", label: others[2]! },
  ]);
  return {
    id: `memory-${phoneme.id}`,
    type: "memory",
    prompt: `发 /${phoneme.ipa}/ 时，哪一句提醒是对的？`,
    options,
    answerId: "true",
    phonemeId: phoneme.id,
  };
}

function listenQuestion(phoneme: Phoneme): QuizQuestion {
  const word = phoneme.examples[Math.floor(Math.random() * phoneme.examples.length)]!;
  return {
    id: `listen-${phoneme.id}-${word.word}`,
    type: "listen",
    prompt: "你听到的单词含哪个音标？",
    hint: "先点播放，再选。",
    playWord: word.word,
    options: optionsFrom(phoneme, distractorsFor(phoneme)),
    answerId: phoneme.id,
    phonemeId: phoneme.id,
  };
}

function contrastQuestion(phoneme: Phoneme): QuizQuestion | null {
  if (!phoneme.contrast) return null;
  const other = getPhoneme(phoneme.contrast.with);
  if (!other) return null;
  return {
    id: `contrast-${phoneme.id}`,
    type: "contrast",
    prompt: `/${phoneme.ipa}/ 和 /${other.ipa}/ 怎么分？`,
    options: shuffle([
      { id: "ok", label: phoneme.contrast.tip },
      { id: "x1", label: "两个音完全一样，只是拼写不同。" },
      { id: "x2", label: "只要读得够大声就能区分。" },
      { id: "x3", label: "中文里有完全对应的音，对一下就行。" },
    ]),
    answerId: "ok",
    phonemeId: phoneme.id,
  };
}

export function buildWriteQuiz(phoneme: Phoneme): QuizQuestion[] {
  return [identifyQuestion(phoneme), nameQuestion(phoneme)];
}

export function buildMemoryQuiz(phoneme: Phoneme): QuizQuestion[] {
  const contrast = contrastQuestion(phoneme);
  return contrast ? [memoryQuestion(phoneme), contrast] : [memoryQuestion(phoneme)];
}

export function buildDayQuiz(day: number): QuizQuestion[] {
  const course = COURSE.find((d) => d.day === day);
  if (!course) return [];
  const pair = course.phonemeIds.map((id) => getPhoneme(id)).filter(Boolean) as Phoneme[];
  const questions: QuizQuestion[] = [];
  for (const phoneme of pair) {
    questions.push(identifyQuestion(phoneme));
    questions.push(listenQuestion(phoneme));
    questions.push(memoryQuestion(phoneme));
  }
  return shuffle(questions).slice(0, 6);
}

export function buildExampleQuestion(phoneme: Phoneme): QuizQuestion {
  return exampleQuestion(phoneme);
}
