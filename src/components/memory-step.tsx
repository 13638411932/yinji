import { ChevronDown, Volume2 } from "lucide-react";
import { useState } from "react";
import { MouthAnim, playWithMouth } from "@/components/mouth-anim";
import { MouthGuide } from "@/components/mouth-guide";
import { Button } from "@/components/ui/button";
import type { Phoneme } from "@/lib/phonemes";
import { cn } from "@/lib/utils";

const CARDS = [
  { key: "mnemonic", title: "记忆口诀", field: "mnemonic" as const },
  { key: "chinese", title: "汉语近似", field: "chineseLike" as const },
  { key: "pitfall", title: "最容易错", field: "pitfall" as const },
] as const;

export function MemoryStep({
  phoneme,
  onComplete,
}: {
  phoneme: Phoneme;
  onComplete: () => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [playing, setPlaying] = useState(false);
  const revealed = CARDS.every((c) => open[c.key]);

  function toggle(key: string) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="space-y-4">
      <MouthAnim key={phoneme.id} phoneme={phoneme} playing={playing} />
      <Button
        type="button"
        variant="soft"
        className="w-full"
        onClick={() => void playWithMouth(phoneme, phoneme.examples[0]!.word, 0.8, setPlaying)}
      >
        <Volume2 className="size-4" />
        看口型并听 {phoneme.examples[0]!.word}
      </Button>
      <MouthGuide phoneme={phoneme} />
      <div className="space-y-2">
        {CARDS.map((card) => {
          const isOpen = open[card.key];
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => toggle(card.key)}
              className="w-full rounded-xl bg-bg-elevated p-4 text-left shadow-card"
            >
              <span className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-fg">{card.title}</span>
                <ChevronDown
                  className={cn(
                    "size-4 text-muted transition-transform duration-200",
                    isOpen && "rotate-180",
                  )}
                />
              </span>
              {isOpen ? (
                <span className="mt-2 block text-sm leading-relaxed text-muted">
                  {phoneme.memory[card.field]}
                </span>
              ) : (
                <span className="mt-1 block text-xs text-faint">点开记住这一条</span>
              )}
            </button>
          );
        })}
      </div>
      {phoneme.contrast ? (
        <div className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
          对比 /{phoneme.contrast.with}/：{phoneme.contrast.tip}
        </div>
      ) : null}
      <Button type="button" className="w-full" size="lg" disabled={!revealed} onClick={onComplete}>
        {revealed ? "记住了，去书写" : "先翻开三条口诀"}
      </Button>
    </div>
  );
}
