import { useNavigate } from "@tanstack/react-router";
import { phonemesOfKind, type Phoneme } from "@/lib/phonemes";
import { cn } from "@/lib/utils";

const HEIGHT: Record<string, number> = {
  close: 0.06,
  "near-close": 0.2,
  "close-mid": 0.38,
  mid: 0.52,
  "open-mid": 0.7,
  open: 0.94,
};
const BACKNESS: Record<string, number> = {
  front: 0.08,
  central: 0.5,
  back: 0.92,
};

function pos(p: Phoneme) {
  const v = p.vowel!;
  const open = HEIGHT[v.height] ?? 0.5;
  const back = BACKNESS[v.backness] ?? 0.5;
  const topL = 36;
  const topR = 300;
  const botL = 92;
  const botR = 244;
  const left = topL + (botL - topL) * open;
  const right = topR + (botR - topR) * open;
  const x = left + (right - left) * back + (v.rounded ? 10 : -4);
  const y = 28 + open * 168;
  return { x, y };
}

export function VowelChart({
  activeId,
  className,
}: {
  activeId?: string;
  className?: string;
}) {
  const navigate = useNavigate();
  const vowels = phonemesOfKind("monophthong");
  return (
    <div className={cn("rounded-xl bg-bg-elevated p-4 shadow-card", className)}>
      <p className="text-xs font-medium tracking-wide text-muted">单元音舌位图</p>
      <svg viewBox="0 0 336 220" className="mt-2 w-full" role="img" aria-label="单元音舌位图">
        <polygon
          points="36,24 300,24 244,200 92,200"
          fill="transparent"
          className="stroke-primary/35"
          strokeWidth="1.5"
        />
        <text x="36" y="16" className="fill-faint" fontSize="10">
          前
        </text>
        <text x="286" y="16" className="fill-faint" fontSize="10">
          后
        </text>
        <text x="8" y="28" className="fill-faint" fontSize="10">
          闭
        </text>
        <text x="8" y="200" className="fill-faint" fontSize="10">
          开
        </text>
        {vowels.map((p) => {
          const { x, y } = pos(p);
          const active = p.id === activeId;
          return (
            <g
              key={p.id}
              className="cursor-pointer"
              onClick={() => navigate({ to: "/phoneme/$id", params: { id: p.id } })}
            >
              <circle
                cx={x}
                cy={y}
                r={active ? 13 : 11}
                className={active ? "fill-primary" : "fill-bg-subtle stroke-primary/50"}
                strokeWidth={active ? 0 : 1}
              />
              <text
                x={x}
                y={y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className={active ? "fill-primary-fg" : "fill-fg"}
                fontSize="11"
                fontFamily="Noto Sans, sans-serif"
                fontWeight="600"
              >
                {p.ipa}
              </text>
            </g>
          );
        })}
      </svg>
      <p className="mt-1 text-xs text-faint">实心点为圆唇。点选音标可查看详情。</p>
    </div>
  );
}
