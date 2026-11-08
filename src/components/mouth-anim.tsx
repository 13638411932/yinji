import { useEffect, useMemo, useState } from "react";
import type { Phoneme } from "@/lib/phonemes";
import { lerpPose, poseDuration, posesFor, type Pose } from "@/lib/articulation";
import { playPhonemeClip, speakEnglish, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function MouthAnim({
  phoneme,
  playing,
  className,
}: {
  phoneme: Phoneme;
  playing: boolean;
  className?: string;
}) {
  const sequence = useMemo(() => posesFor(phoneme), [phoneme]);
  const [pose, setPose] = useState<Pose>(sequence[0]!);

  useEffect(() => {
    const from = sequence[0]!;
    const to = sequence[sequence.length - 1]!;
    setPose(from);
    if (!playing) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPose(to);
      return;
    }
    const duration = poseDuration(phoneme);
    const restish: Pose = {
      ...from,
      jaw: from.jaw * 0.55,
      lipClose: Math.min(1, from.lipClose + 0.2),
      airflow: "none",
    };
    let frame = 0;
    const started = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - (1 - t) * (1 - t);
      if (sequence.length === 1) {
        const attack = Math.min(1, t / 0.28);
        const aEased = 1 - (1 - attack) * (1 - attack);
        setPose(lerpPose(restish, from, aEased));
      } else {
        setPose(lerpPose(from, to, eased));
      }
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phoneme, playing, sequence]);

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl bg-bg-elevated p-3 shadow-card", className)}
      data-playing={playing ? "1" : "0"}
    >
      <div className="flex items-center justify-between px-1">
        <p className="text-xs font-medium tracking-wide text-muted">发音动画</p>
        <p className="font-ipa text-xs text-primary">/{phoneme.ipa}/</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <FrontMouth pose={pose} playing={playing} />
        <SideMouth pose={pose} playing={playing} />
      </div>

      <WaveBars playing={playing} />

      <div className="mt-2 flex flex-wrap gap-1.5 px-1 pb-0.5">
        <Tag>{pose.round > 0.5 ? "圆唇" : "展唇"}</Tag>
        <Tag>{pose.jaw > 0.55 ? "开口大" : pose.jaw < 0.25 ? "开口小" : "开口中"}</Tag>
        <Tag>{pose.tongueX > 0.66 ? "舌后" : pose.tongueX < 0.34 ? "舌前" : "舌央"}</Tag>
        {pose.voiced ? <Tag>声带振动</Tag> : <Tag>清音</Tag>}
        {pose.airflow === "burst" ? <Tag>爆破</Tag> : null}
        {pose.airflow === "fricative" ? <Tag>摩擦</Tag> : null}
        {pose.airflow === "nasal" ? <Tag>鼻腔</Tag> : null}
      </div>
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">{children}</span>
  );
}

function WaveBars({ playing }: { playing: boolean }) {
  return (
    <div className="pointer-events-none absolute right-3 top-3 flex h-8 items-end gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={cn(
            "w-0.5 origin-bottom rounded-full bg-primary",
            playing ? "h-7 animate-yinji-wave" : "h-2 opacity-40",
          )}
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

function FrontMouth({ pose, playing }: { pose: Pose; playing: boolean }) {
  const cx = 100;
  const cy = 88;
  const halfW = 68 * (1 - pose.round * 0.5) * (0.82 + (1 - pose.lipClose) * 0.18);
  const gap = Math.max(2.8, (1 - pose.lipClose) * (7 + pose.jaw * 46));
  const upperY = cy - gap * 0.46;
  const lowerY = cy + gap * 0.54;
  const bow = 5 + (1 - pose.round) * 4;
  const pucker = pose.round;
  const stroke = 12 - pucker * 2;
  const showTeeth = gap > 12 && pose.lipClose < 0.6;
  const tonguePeek = Math.max(0, gap * 0.36 - pose.tongueY * 6);
  const bite = pose.teethBite;
  const inter = pose.interdental;

  return (
    <div className="rounded-lg bg-bg">
      <p className="px-2 pt-2 text-xs tracking-wide text-faint">正面 · 口型</p>
      <svg viewBox="0 0 200 160" className="w-full" role="img" aria-label="正面口型">
        <ellipse cx="100" cy="86" rx="84" ry="62" className="fill-bg-subtle" />

        <ellipse
          cx={cx}
          cy={(upperY + lowerY) / 2}
          rx={Math.max(8, halfW * 0.88)}
          ry={Math.max(2.2, gap / 2)}
          className="fill-ink/80"
        />

        {showTeeth ? (
          <g>
            <rect
              x={cx - halfW + 8}
              y={upperY + 1}
              width={halfW * 2 - 16}
              height={Math.min(12, gap * 0.3)}
              rx="1.4"
              className="fill-bg-elevated"
            />
            {gap > 20 ? (
              <rect
                x={cx - halfW + 12}
                y={lowerY - Math.min(9, gap * 0.2)}
                width={halfW * 2 - 24}
                height={Math.min(9, gap * 0.2)}
                rx="1.2"
                className="fill-bg-elevated/80"
              />
            ) : null}
          </g>
        ) : null}

        {gap > 11 && inter < 0.4 ? (
          <ellipse
            cx={cx}
            cy={cy + gap * 0.14 + pose.tongueY * 3}
            rx={halfW * (0.52 - pucker * 0.12)}
            ry={tonguePeek}
            className="fill-primary/50"
          />
        ) : null}

        {inter > 0.4 ? (
          <ellipse cx={cx} cy={cy + 2} rx="13" ry="8" className="fill-primary/75" />
        ) : null}

        {bite > 0.45 ? (
          <g>
            <rect x={cx - 26} y={cy - 12} width="52" height="11" rx="1.5" className="fill-bg-elevated" />
            <path
              d={`M ${cx - halfW * 0.72} ${cy + 8} Q ${cx} ${cy + 18} ${cx + halfW * 0.72} ${cy + 8}`}
              fill="none"
              className="stroke-primary"
              strokeWidth="11"
              strokeLinecap="round"
            />
          </g>
        ) : (
          <g className={playing && pose.voiced ? "animate-yinji-vibrate" : ""} style={{ transformOrigin: "100px 88px" }}>
            <path
              d={`M ${cx - halfW} ${upperY} Q ${cx} ${upperY - bow} ${cx + halfW} ${upperY}`}
              fill="none"
              className="stroke-primary"
              strokeWidth={stroke}
              strokeLinecap="round"
            />
            <path
              d={`M ${cx - halfW} ${lowerY} Q ${cx} ${lowerY + 7 + pose.jaw * 5} ${cx + halfW} ${lowerY}`}
              fill="none"
              className="stroke-primary"
              strokeWidth={stroke + 1}
              strokeLinecap="round"
            />
          </g>
        )}

        {playing && (pose.airflow === "fricative" || pose.airflow === "vowel" || pose.airflow === "nasal") ? (
          <g className="animate-yinji-air">
            <circle cx="24" cy={cy} r="3" className="fill-primary/45" />
            <circle cx="14" cy={cy - 9} r="2.2" className="fill-primary/30" />
            <circle cx="12" cy={cy + 11} r="2" className="fill-primary/25" />
          </g>
        ) : null}
        {playing && pose.airflow === "burst" ? (
          <circle cx="30" cy={cy} r="15" className="fill-none stroke-primary/50 animate-yinji-burst" />
        ) : null}
        {playing ? (
          <g className="animate-yinji-ring" style={{ transformOrigin: "18px 88px" }}>
            <circle cx="18" cy={cy} r="16" fill="none" className="stroke-primary/30" strokeWidth="1.4" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

function SideMouth({ pose, playing }: { pose: Pose; playing: boolean }) {
  const jaw = pose.jaw * 28;
  const lipGap = (1 - pose.lipClose) * (5 + pose.jaw * 20);
  const tongueX = 78 + pose.tongueX * 96;
  const tongueY = 86 + pose.tongueY * 48 + jaw * 0.22;
  const tipX = 58 + pose.tongueX * 18 - pose.interdental * 16;
  const tipY = tongueY - 8 - pose.tip * 22 - pose.interdental * 8;
  const velumLift = pose.velum * 20;
  const pucker = pose.round;

  const tongue = `M ${tipX} ${tipY}
    Q ${tipX + 22} ${tipY - 12} ${tongueX} ${tongueY - 18}
    Q ${tongueX + 38} ${tongueY - 8} ${tongueX + 42} ${tongueY + 6}
    Q ${tongueX + 24} ${tongueY + 36 + jaw * 0.15} ${tongueX - 8} ${tongueY + 30 + jaw * 0.2}
    Q ${tipX + 10} ${tongueY + 16} ${tipX + 4} ${tipY + 12}
    Z`;

  return (
    <div className="rounded-lg bg-bg">
      <p className="px-2 pt-2 text-xs tracking-wide text-faint">侧面 · 舌位</p>
      <svg viewBox="0 0 260 160" className="w-full" role="img" aria-label="侧面舌位">
        <path
          d="M62 40 C108 16 176 18 214 48 C236 70 238 112 214 138 C176 164 108 166 70 146 C44 130 38 78 62 40 Z"
          className="fill-bg-subtle"
        />

        <path
          d="M84 48 C132 30 186 34 214 62"
          fill="none"
          className="stroke-primary/35"
          strokeWidth="2"
        />
        <path
          d={`M214 62 Q ${228} ${78 - velumLift} ${220} ${108 - velumLift * 0.4}`}
          fill="none"
          className="stroke-primary/45"
          strokeWidth="2.2"
        />
        <path
          d="M78 66 C118 52 168 50 204 66"
          fill="none"
          className="stroke-primary/40"
          strokeWidth="2"
        />

        <rect x="68" y="70" width="14" height="7" rx="1" className="fill-bg-elevated stroke-border" />
        <g transform={`translate(0 ${jaw})`}>
          <rect x="68" y="92" width="14" height="7" rx="1" className="fill-bg-elevated stroke-border" />
        </g>

        <g transform={`translate(${pucker * 4} 0)`}>
          <path
            d={`M46 78 C54 ${74 - pucker * 3}, 64 ${76 - lipGap * 0.1}, 74 ${78 - lipGap * 0.05}`}
            fill="none"
            className="stroke-primary"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d={`M46 ${80 + lipGap} C54 ${86 + lipGap}, 64 ${88 + lipGap}, 74 ${86 + lipGap}`}
            fill="none"
            className="stroke-primary"
            strokeWidth="6"
            strokeLinecap="round"
            transform={`translate(0 ${jaw * 0.35})`}
          />
        </g>

        <path d={tongue} className="fill-primary/50" />
        <ellipse cx={tipX + 2} cy={tipY + 2} rx="9" ry="6" className="fill-primary/70" />

        {pose.velum > 0.5 ? (
          <g className="animate-yinji-air">
            <circle cx="196" cy="44" r="2.4" className="fill-primary/40" />
            <circle cx="186" cy="36" r="1.8" className="fill-primary/30" />
          </g>
        ) : null}

        <g className={playing && pose.voiced ? "animate-yinji-vibrate" : ""} style={{ transformOrigin: "214px 128px" }}>
          <rect
            x="204"
            y="120"
            width="20"
            height={pose.voiced ? 12 : 6}
            rx="2.5"
            className={pose.voiced ? "fill-primary" : "fill-faint/50"}
          />
        </g>
        <text x="198" y="146" className="fill-faint" fontSize="7">
          声带
        </text>

        {playing && pose.airflow === "burst" ? (
          <circle cx="42" cy={80 + lipGap / 2} r="12" className="fill-none stroke-primary/45 animate-yinji-burst" />
        ) : null}
        {playing && (pose.airflow === "fricative" || pose.airflow === "vowel") ? (
          <g className="animate-yinji-air">
            <circle cx="40" cy={80 + lipGap / 2} r="2.6" className="fill-primary/45" />
            <circle cx="30" cy={76 + lipGap / 2} r="2" className="fill-primary/30" />
          </g>
        ) : null}
      </svg>
    </div>
  );
}

export async function playWithMouth(
  phoneme: Phoneme,
  word: string,
  rate: number,
  setPlaying: (v: boolean) => void,
) {
  stopSpeaking();
  setPlaying(true);
  const min = poseDuration(phoneme);
  try {
    await Promise.all([speakEnglish(word, rate), new Promise((r) => window.setTimeout(r, min))]);
  } finally {
    setPlaying(false);
  }
}

/**
 * 只听音标本身：播放该音素的独立录音，同时让口型动画走一遍。
 * 没有录音（极少数音素）才退回朗读例词，避免点了没反应。
 */
export async function playPhonemeAlone(phoneme: Phoneme, setPlaying: (v: boolean) => void) {
  stopSpeaking();
  setPlaying(true);
  const min = poseDuration(phoneme);
  try {
    // 孤立的音素录音都被拉长到 0.6 秒左右，短元音听起来会像长音。
    // 短元音截到 0.38 秒，让长短在耳朵上真的分得开。
    const maxMs = phoneme.vowel?.length === "short" ? 380 : undefined;
    const played = await playPhonemeClip(phoneme.id, maxMs);
    if (!played) {
      await Promise.all([
        speakEnglish(phoneme.examples[0]!.word, 0.8),
        new Promise((r) => window.setTimeout(r, min)),
      ]);
      return;
    }
    await new Promise((r) => window.setTimeout(r, min));
  } finally {
    setPlaying(false);
  }
}
