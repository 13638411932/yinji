import { Check, Volume2, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { QuizQuestion } from "@/lib/quiz";
import { speakEnglish } from "@/lib/speech";
import { cn } from "@/lib/utils";

export function QuizCard({
  question,
  index,
  total,
  onResolved,
}: {
  question: QuizQuestion;
  index: number;
  total: number;
  onResolved: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const locked = picked !== null;
  const correct = picked === question.answerId;

  function choose(id: string) {
    if (locked) return;
    setPicked(id);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs font-medium tracking-wide text-muted">
          辨形 {index + 1} / {total}
        </p>
        {locked ? (
          <p className={cn("text-xs font-medium", correct ? "text-primary" : "text-danger")}>
            {correct ? "正确" : "再记一次"}
          </p>
        ) : null}
      </div>
      <h2 className="font-display text-xl font-semibold leading-snug text-fg text-balance">
        {question.prompt}
      </h2>
      {question.playWord ? (
        <Button
          type="button"
          variant="soft"
          onClick={() => void speakEnglish(question.playWord!, 0.8)}
        >
          <Volume2 className="size-4" />
          播放 {question.playWord}
        </Button>
      ) : null}
      {question.hint ? <p className="text-sm text-muted">{question.hint}</p> : null}
      <div className="grid gap-2">
        {question.options.map((opt) => {
          const isPick = picked === opt.id;
          const isAnswer = opt.id === question.answerId;
          const showGood = locked && isAnswer;
          const showBad = locked && isPick && !isAnswer;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => choose(opt.id)}
              disabled={locked}
              className={cn(
                "flex min-h-14 items-center justify-between gap-3 rounded-lg px-4 py-3 text-left shadow-card transition-[transform,box-shadow,background-color] duration-150",
                !locked && "bg-bg-elevated hover:shadow-card-hover",
                showGood && "bg-success-soft text-primary",
                showBad && "bg-danger-soft text-danger",
                locked && !showGood && !showBad && "bg-bg-elevated opacity-60",
              )}
            >
              <span>
                <span className="block font-ipa text-lg font-medium leading-none">{opt.label}</span>
                {opt.sub ? <span className="mt-1 block text-xs text-muted">{opt.sub}</span> : null}
              </span>
              {showGood ? <Check className="size-4" /> : null}
              {showBad ? <X className="size-4" /> : null}
            </button>
          );
        })}
      </div>
      {locked ? (
        <Button type="button" className="w-full" size="lg" onClick={() => onResolved(correct)}>
          继续
        </Button>
      ) : null}
    </div>
  );
}
