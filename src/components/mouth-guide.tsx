import type { Phoneme } from "@/lib/phonemes";
import { cn } from "@/lib/utils";

const HEIGHT: Record<string, number> = {
  close: 0.08,
  "near-close": 0.2,
  "close-mid": 0.38,
  mid: 0.52,
  "open-mid": 0.72,
  open: 0.92,
};

const BACKNESS: Record<string, number> = {
  front: 0.12,
  central: 0.5,
  back: 0.88,
};

export function MouthGuide({ phoneme, className }: { phoneme: Phoneme; className?: string }) {
  if (phoneme.vowel) {
    return <VowelMini phoneme={phoneme} className={className} />;
  }
  return <ConsonantMini phoneme={phoneme} className={className} />;
}

function VowelMini({ phoneme, className }: { phoneme: Phoneme; className?: string }) {
  const v = phoneme.vowel!;
  const openness = HEIGHT[v.height] ?? 0.5;
  const back = BACKNESS[v.backness] ?? 0.5;
  const x = trapX(back, openness);
  const y = 18 + openness * 84;

  return (
    <div className={cn("rounded-xl bg-bg-elevated p-4 shadow-card", className)}>
      <p className="text-xs font-medium tracking-wide text-muted">舌位</p>
      <svg viewBox="0 0 200 120" className="mt-2 w-full" aria-hidden="true">
        <polygon
          points="18,16 182,16 150,108 50,108"
          fill="transparent"
          className="stroke-primary/40"
          strokeWidth="1.5"
        />
        <text x="18" y="12" className="fill-faint" fontSize="8">
          前
        </text>
        <text x="170" y="12" className="fill-faint" fontSize="8">
          后
        </text>
        <text x="4" y="22" className="fill-faint" fontSize="8">
          闭
        </text>
        <text x="4" y="108" className="fill-faint" fontSize="8">
          开
        </text>
        <circle cx={x} cy={y} r={v.rounded ? 7 : 6} className="fill-primary" />
        {v.rounded ? (
          <circle cx={x} cy={y} r="3" className="fill-bg-elevated" />
        ) : null}
      </svg>
      <p className="mt-2 text-sm leading-relaxed text-muted">{phoneme.memory.mouth}</p>
    </div>
  );
}

function trapX(back: number, open: number) {
  const topL = 18;
  const topR = 182;
  const botL = 50;
  const botR = 150;
  const left = topL + (botL - topL) * open;
  const right = topR + (botR - topR) * open;
  return left + (right - left) * back;
}

const PLACE_LABEL: Record<string, string> = {
  bilabial: "双唇",
  labiodental: "唇齿",
  dental: "齿间",
  alveolar: "齿龈",
  "post-alveolar": "后齿龈",
  palatal: "硬腭",
  velar: "软腭",
  glottal: "声门",
  "labial-velar": "双唇软腭",
};

const MANNER_LABEL: Record<string, string> = {
  plosive: "爆破",
  fricative: "摩擦",
  affricate: "破擦",
  nasal: "鼻音",
  lateral: "边音",
  approximant: "近音",
};

export function ConsonantMini({ phoneme, className }: { phoneme: Phoneme; className?: string }) {
  const c = phoneme.consonant!;
  return (
    <div className={cn("rounded-xl bg-bg-elevated p-4 shadow-card", className)}>
      <p className="text-xs font-medium tracking-wide text-muted">发音部位</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          {PLACE_LABEL[c.place]}
        </span>
        <span className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-medium text-fg">
          {MANNER_LABEL[c.manner]}
        </span>
        <span className="rounded-full bg-bg-subtle px-3 py-1 text-xs font-medium text-fg">
          {c.voiced ? "浊音 · 声带振动" : "清音 · 声带不振动"}
        </span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted">{phoneme.memory.mouth}</p>
    </div>
  );
}
