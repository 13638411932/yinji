import type { Phoneme, Place, VowelBackness, VowelHeight } from "./phonemes";
import { getPhoneme } from "./phonemes";

export type Airflow = "none" | "burst" | "fricative" | "vowel" | "nasal";

export type Pose = {
  jaw: number;
  round: number;
  lipClose: number;
  tongueX: number;
  tongueY: number;
  tip: number;
  teethBite: number;
  interdental: number;
  velum: number;
  voiced: boolean;
  airflow: Airflow;
};

const JAW: Record<VowelHeight, number> = {
  close: 0.14,
  "near-close": 0.22,
  "close-mid": 0.34,
  mid: 0.46,
  "open-mid": 0.64,
  open: 0.86,
};

const TONGUE_Y: Record<VowelHeight, number> = {
  close: 0.1,
  "near-close": 0.2,
  "close-mid": 0.34,
  mid: 0.5,
  "open-mid": 0.7,
  open: 0.9,
};

const TONGUE_X: Record<VowelBackness, number> = {
  front: 0.16,
  central: 0.5,
  back: 0.84,
};

const REST: Pose = {
  jaw: 0.28,
  round: 0.12,
  lipClose: 0,
  tongueX: 0.45,
  tongueY: 0.55,
  tip: 0.1,
  teethBite: 0,
  interdental: 0,
  velum: 0,
  voiced: false,
  airflow: "none",
};

function vowelPose(p: Phoneme): Pose {
  const v = p.vowel;
  if (!v) return REST;
  return {
    ...REST,
    jaw: JAW[v.height],
    round: v.rounded ? 0.92 : 0.08,
    tongueX: TONGUE_X[v.backness],
    tongueY: TONGUE_Y[v.height],
    voiced: true,
    airflow: "vowel",
  };
}

const PLACE_POSE: Record<Place, Partial<Pose>> = {
  bilabial: { lipClose: 1, jaw: 0.12, tongueY: 0.55, tongueX: 0.4 },
  labiodental: { teethBite: 1, jaw: 0.18, lipClose: 0.35 },
  dental: { interdental: 1, tip: 1, jaw: 0.22, tongueX: 0.12, tongueY: 0.22 },
  alveolar: { tip: 1, tongueX: 0.22, tongueY: 0.18, jaw: 0.2 },
  "post-alveolar": { tip: 0.7, tongueX: 0.34, tongueY: 0.16, jaw: 0.22, round: 0.45 },
  palatal: { tongueX: 0.42, tongueY: 0.08, jaw: 0.2 },
  velar: { tongueX: 0.86, tongueY: 0.12, jaw: 0.2 },
  glottal: { jaw: 0.26, tongueY: 0.55, tongueX: 0.5 },
  "labial-velar": { round: 0.95, lipClose: 0.35, tongueX: 0.82, tongueY: 0.18, jaw: 0.18 },
};

function consonantPose(p: Phoneme): Pose {
  const c = p.consonant;
  if (!c) return REST;
  const air: Airflow =
    c.manner === "plosive"
      ? "burst"
      : c.manner === "fricative" || c.manner === "affricate"
        ? "fricative"
        : c.manner === "nasal"
          ? "nasal"
          : "none";
  return {
    ...REST,
    ...PLACE_POSE[c.place],
    velum: c.manner === "nasal" ? 1 : 0,
    voiced: c.voiced,
    airflow: air,
    lipClose: c.place === "bilabial" && (c.manner === "plosive" || c.manner === "nasal") ? 1 : PLACE_POSE[c.place].lipClose ?? 0,
  };
}

const GLIDE_END: Record<string, string> = {
  eɪ: "ɪ",
  aɪ: "ɪ",
  ɔɪ: "ɪ",
  əʊ: "ʊ",
  aʊ: "ʊ",
  ɪə: "ə",
  eə: "ə",
  ʊə: "ə",
};

export function posesFor(phoneme: Phoneme): Pose[] {
  if (phoneme.kind === "diphthong") {
    const start = vowelPose(phoneme);
    const endId = GLIDE_END[phoneme.id];
    const endPh = endId ? getPhoneme(endId) : undefined;
    const end = endPh ? vowelPose(endPh) : { ...start, tongueY: Math.max(0.1, start.tongueY - 0.25), jaw: Math.max(0.14, start.jaw - 0.2) };
    return [start, end];
  }
  if (phoneme.kind === "consonant" && phoneme.consonant?.manner === "affricate") {
    const closed = { ...consonantPose(phoneme), lipClose: phoneme.consonant.place === "bilabial" ? 1 : 0, airflow: "burst" as const };
    const fric = { ...consonantPose(phoneme), lipClose: 0, airflow: "fricative" as const };
    return [closed, fric];
  }
  if (phoneme.kind === "consonant" && phoneme.consonant?.manner === "plosive") {
    const closed = { ...consonantPose(phoneme), airflow: "none" as const };
    const open = { ...consonantPose(phoneme), lipClose: 0, jaw: Math.min(0.4, (consonantPose(phoneme).jaw || 0.2) + 0.12), airflow: "burst" as const };
    return [closed, open];
  }
  if (phoneme.vowel) return [vowelPose(phoneme)];
  return [consonantPose(phoneme)];
}

export function lerpPose(a: Pose, b: Pose, t: number): Pose {
  const m = Math.max(0, Math.min(1, t));
  const mix = (x: number, y: number) => x + (y - x) * m;
  return {
    jaw: mix(a.jaw, b.jaw),
    round: mix(a.round, b.round),
    lipClose: mix(a.lipClose, b.lipClose),
    tongueX: mix(a.tongueX, b.tongueX),
    tongueY: mix(a.tongueY, b.tongueY),
    tip: mix(a.tip, b.tip),
    teethBite: mix(a.teethBite, b.teethBite),
    interdental: mix(a.interdental, b.interdental),
    velum: mix(a.velum, b.velum),
    voiced: m < 0.5 ? a.voiced : b.voiced,
    airflow: m < 0.45 ? a.airflow : b.airflow,
  };
}

export function poseDuration(phoneme: Phoneme): number {
  if (phoneme.kind === "diphthong") return 1400;
  if (phoneme.vowel?.length === "long") return 1200;
  if (phoneme.consonant?.manner === "affricate") return 900;
  if (phoneme.consonant?.manner === "plosive") return 700;
  return 900;
}
