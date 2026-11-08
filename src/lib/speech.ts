import { AUDIO_SLUGS } from "./audio-manifest";
import { PHONEME_CLIPS } from "./phoneme-audio";

type SpeechWindow = Window & {
  SpeechRecognition?: new () => BrowserRecognition;
  webkitSpeechRecognition?: new () => BrowserRecognition;
};

type BrowserRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: { results: { [index: number]: { [index: number]: { transcript: string } } } }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  abort: () => void;
};

let voicePromise: Promise<SpeechSynthesisVoice | null> | null = null;

function loadVoices(): SpeechSynthesisVoice[] {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  return window.speechSynthesis.getVoices();
}

function pickVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const scored = voices
    .filter((v) => v.lang.toLowerCase().startsWith("en"))
    .map((v) => {
      const lang = v.lang.toLowerCase();
      const name = v.name.toLowerCase();
      let score = 0;
      if (lang.startsWith("en-gb")) score += 8;
      if (lang.startsWith("en-uk")) score += 8;
      if (name.includes("british") || name.includes("uk english") || name.includes("daniel")) score += 6;
      if (name.includes("google") && lang.startsWith("en-gb")) score += 4;
      if (v.localService) score += 1;
      return { v, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored[0]?.v ?? voices.find((v) => v.lang.toLowerCase().startsWith("en")) ?? null;
}

export function waitForVoice(): Promise<SpeechSynthesisVoice | null> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve(null);
  if (voicePromise) return voicePromise;
  voicePromise = new Promise((resolve) => {
    const existing = loadVoices();
    if (existing.length) {
      resolve(pickVoice(existing));
      return;
    }
    const done = () => {
      resolve(pickVoice(loadVoices()));
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = done;
    window.setTimeout(done, 800);
  });
  return voicePromise;
}

const AUDIO_BASE = "/audio";
let currentAudio: HTMLAudioElement | null = null;
let audioNoticeShown = false;

/** 例词 → 音频文件名：小写、非字母数字压成连字符。 */
function audioSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function stopAudioPlayback() {
  if (currentAudio === null) return;
  currentAudio.onended = null;
  currentAudio.onerror = null;
  currentAudio.pause();
  currentAudio = null;
}

/** 播放一个音频地址；false 表示文件缺失或播放被拒，调用方应退回语音合成。 */
function playAudioUrl(url: string, maxMs?: number): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio(url);
    currentAudio = audio;
    let settled = false;
    const finish = (played: boolean) => {
      if (settled) return;
      settled = true;
      audio.onended = null;
      audio.onerror = null;
      if (currentAudio === audio) currentAudio = null;
      resolve(played);
    };
    audio.preload = "auto";
    audio.onended = () => finish(true);
    audio.onerror = () => finish(false);
    if (maxMs !== undefined) {
      window.setTimeout(() => {
        if (settled) return;
        audio.pause();
        finish(true);
      }, maxMs);
    }
    const started = audio.play();
    if (started !== undefined) started.catch(() => finish(false));
  });
}

/**
 * 只听音标本身：播放该音素的独立录音。
 *
 * 有的音标（双元音、塞擦音）由两段真实录音顺序播放组成，用来演示滑动/组合，
 * 因为公开语料里没有这些音素的独立录音，而 TTS 又念不出孤立音素。
 * 返回 false 表示这个音标没有录音，调用方应退回朗读例词。
 */
export async function playPhonemeClip(id: string, maxMs?: number): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const clips = PHONEME_CLIPS[id];
  if (clips === undefined || clips.length === 0) return false;
  for (const file of clips) {
    const played = await playAudioUrl(`${AUDIO_BASE}/phoneme/${file}`, maxMs);
    if (!played) return false;
  }
  return true;
}

/** 系统语音合成兜底；false 表示设备上没有任何可用音色（说了也不会有声音）。 */
function speakWithSynthesis(text: string, rate: number): Promise<boolean> {
  if (typeof window === "undefined" || !window.speechSynthesis) return Promise.resolve(false);
  return waitForVoice().then(
    (voice) =>
      new Promise<boolean>((resolve) => {
        if (voice === null) {
          resolve(false);
          return;
        }
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = voice.lang || "en-GB";
        utter.voice = voice;
        utter.rate = rate;
        utter.pitch = 1;
        utter.onend = () => resolve(true);
        utter.onerror = () => resolve(false);
        window.speechSynthesis.speak(utter);
      }),
  );
}

/** 静默失败会让用户以为网站坏了，所以声音彻底不可用时提示一次。 */
function showAudioUnavailableNotice() {
  if (audioNoticeShown || typeof document === "undefined") return;
  audioNoticeShown = true;
  const notice = document.createElement("div");
  notice.textContent = "此设备无法播放发音（音频缺失且系统语音引擎不可用）";
  notice.style.cssText = [
    "position:fixed",
    "left:50%",
    "bottom:24px",
    "transform:translateX(-50%)",
    "z-index:9999",
    "max-width:90vw",
    "padding:10px 16px",
    "border-radius:10px",
    "background:rgba(20,20,20,0.92)",
    "color:#fff",
    "font-size:13px",
    "line-height:1.5",
    "text-align:center",
    "pointer-events:none",
  ].join(";");
  document.body.appendChild(notice);
  window.setTimeout(() => notice.remove(), 3200);
}

/**
 * 念一个英文词：优先播放随包发布的音频，失败才退回系统语音合成。
 * 这样发音不依赖手机是否装了 TTS 引擎。
 */
export async function speakEnglish(text: string, rate = 0.86): Promise<void> {
  if (typeof window === "undefined") return;
  stopSpeaking();
  const slug = audioSlug(text);
  if (AUDIO_SLUGS.has(slug)) {
    const played = await playAudioUrl(`${AUDIO_BASE}/${slug}.mp3`);
    if (played) return;
  }
  const spoke = await speakWithSynthesis(text, rate);
  if (!spoke) showAudioUnavailableNotice();
}

export function stopSpeaking() {
  stopAudioPlayback();
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function canRecognize(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as SpeechWindow;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function recognizeOnce(lang = "en-GB"): Promise<string> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("unsupported"));
  }
  const w = window as SpeechWindow;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return Promise.reject(new Error("unsupported"));

  return new Promise((resolve, reject) => {
    const rec = new Ctor();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    rec.continuous = false;
    let settled = false;
    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      settled = true;
      resolve(transcript);
    };
    rec.onerror = (event) => {
      if (settled) return;
      settled = true;
      reject(new Error(event.error || "recognize-failed"));
    };
    rec.onend = () => {
      if (settled) return;
      settled = true;
      reject(new Error("empty"));
    };
    try {
      rec.start();
    } catch (err) {
      reject(err);
    }
  });
}

function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/[^a-z']/g, "");
}

function levenshtein(a: string, b: string): number {
  const rows = a.length + 1;
  const cols = b.length + 1;
  const grid: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) grid[i]![0] = i;
  for (let j = 0; j < cols; j++) grid[0]![j] = j;
  for (let i = 1; i < rows; i++) {
    for (let j = 1; j < cols; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      grid[i]![j] = Math.min(
        grid[i - 1]![j]! + 1,
        grid[i]![j - 1]! + 1,
        grid[i - 1]![j - 1]! + cost,
      );
    }
  }
  return grid[a.length]![b.length]!;
}

export function matchesWord(said: string, target: string): boolean {
  const a = normalizeWord(said);
  const b = normalizeWord(target);
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.includes(b) || b.includes(a)) return true;
  const limit = b.length <= 3 ? 1 : 2;
  return levenshtein(a, b) <= limit;
}
