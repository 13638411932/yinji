import { useMemo, useState } from "react";
import { QuizCard } from "@/components/quiz-card";
import { WriteCanvas } from "@/components/write-canvas";
import { Button } from "@/components/ui/button";
import type { Phoneme } from "@/lib/phonemes";
import { buildWriteQuiz } from "@/lib/quiz";

export function WriteStep({
  phoneme,
  onComplete,
}: {
  phoneme: Phoneme;
  onComplete: (correct: number, total: number) => void;
}) {
  const questions = useMemo(() => buildWriteQuiz(phoneme), [phoneme]);
  const [phase, setPhase] = useState<"trace" | "quiz">("trace");
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);

  function finishTrace() {
    setPhase("quiz");
  }

  function onResolved(ok: boolean) {
    const nextCorrect = correctCount + (ok ? 1 : 0);
    if (qIndex + 1 >= questions.length) {
      onComplete(nextCorrect, questions.length);
      return;
    }
    setCorrectCount(nextCorrect);
    setQIndex(qIndex + 1);
  }

  if (phase === "quiz") {
    return (
      <QuizCard
        key={questions[qIndex]!.id}
        question={questions[qIndex]!}
        index={qIndex}
        total={questions.length}
        onResolved={onResolved}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-bg-elevated p-4 shadow-card">
        <p className="text-xs font-medium tracking-wide text-muted">怎么写</p>
        <p className="mt-2 text-sm leading-relaxed text-fg">{phoneme.writing.strokes}</p>
        <p className="mt-2 text-sm text-muted">{phoneme.writing.hint}</p>
        <p className="mt-1 text-xs text-faint">像 {phoneme.writing.similarTo}</p>
      </div>
      <WriteCanvas glyph={phoneme.ipa} />
      <Button type="button" className="w-full" size="lg" onClick={finishTrace}>
        写好了，去辨形
      </Button>
    </div>
  );
}
