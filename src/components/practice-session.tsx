import { Link } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
import { useMemo, useState } from "react";
import { Ipa } from "@/components/ipa";
import { MemoryStep } from "@/components/memory-step";
import { QuizCard } from "@/components/quiz-card";
import { SpeakPanel } from "@/components/speak-panel";
import { Button } from "@/components/ui/button";
import { WriteStep } from "@/components/write-step";
import type { CourseDay } from "@/lib/curriculum";
import { getPhoneme } from "@/lib/phonemes";
import { useProgress } from "@/lib/progress-store";
import { buildDayQuiz } from "@/lib/quiz";

type Step =
  | { type: "intro" }
  | { type: "memory"; which: 0 | 1 }
  | { type: "write"; which: 0 | 1 }
  | { type: "speak"; which: 0 | 1 }
  | { type: "quiz" }
  | { type: "done" };

const STEPS: Step[] = [
  { type: "intro" },
  { type: "memory", which: 0 },
  { type: "write", which: 0 },
  { type: "speak", which: 0 },
  { type: "memory", which: 1 },
  { type: "write", which: 1 },
  { type: "speak", which: 1 },
  { type: "quiz" },
  { type: "done" },
];

const SKILL_LABEL: Record<string, string> = {
  intro: "今日一对",
  memory: "记忆",
  write: "书写",
  speak: "朗读",
  quiz: "综合",
  done: "完成",
};

export function PracticeSession({ day }: { day: CourseDay }) {
  const pair = day.phonemeIds.map((id) => getPhoneme(id)!);
  const [stepIndex, setStepIndex] = useState(0);
  const [score, setScore] = useState({ memory: 0, write: 0, speak: 0, quizCorrect: 0, quizTotal: 0 });
  const quiz = useMemo(() => buildDayQuiz(day.day), [day.day]);
  const [quizIndex, setQuizIndex] = useState(0);
  const markSkill = useProgress((s) => s.markSkill);
  const recordQuiz = useProgress((s) => s.recordQuiz);
  const completeDay = useProgress((s) => s.completeDay);
  const completedDays = useProgress((s) => s.completedDays);
  const streak = useProgress((s) => s.streak);

  const step = STEPS[stepIndex]!;
  const phoneme = "which" in step ? pair[step.which]! : pair[0]!;
  const innerTotal = STEPS.length - 2;
  const innerIndex = Math.min(Math.max(stepIndex - 1, 0), innerTotal);

  function next() {
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  const title =
    step.type === "intro"
      ? `第 ${day.day} 天`
      : step.type === "quiz"
        ? "综合辨形"
        : step.type === "done"
          ? "今日完成"
          : `${SKILL_LABEL[step.type]}  /${phoneme.ipa}/`;

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="sticky top-0 z-10 border-b border-border/70 bg-bg/90 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <Button asChild variant="ghost" size="icon-sm" aria-label="返回">
            <Link to="/">
              <ArrowLeft className="size-5" />
            </Link>
          </Button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-fg">{title}</p>
            <p className="text-xs text-muted">{day.unit}</p>
          </div>
          <span className="text-xs tabular-nums text-muted">
            {step.type === "intro" || step.type === "done" ? "" : `${innerIndex}/${innerTotal}`}
          </span>
        </div>
        {step.type !== "intro" && step.type !== "done" ? (
          <div className="mx-auto mt-3 flex max-w-2xl gap-1 px-1">
            {Array.from({ length: innerTotal }).map((_, i) => (
              <span
                key={i}
                className={`h-1 flex-1 rounded-full ${i < innerIndex ? "bg-primary" : "bg-bg-subtle"}`}
              />
            ))}
          </div>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
        {step.type === "intro" ? (
          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted">第 {day.day} 天 · {day.focus}</p>
              <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{day.title}</h1>
              <p className="mt-3 text-sm leading-relaxed text-muted">{day.tip}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {pair.map((p) => (
                <div key={p.id} className="rounded-xl bg-bg-elevated px-3 py-6 text-center shadow-card">
                  <Ipa className="text-4xl">{p.ipa}</Ipa>
                  <p className="mt-3 text-xs text-muted">{p.nameZh}</p>
                </div>
              ))}
            </div>
            <ol className="space-y-2 text-sm text-muted">
              <li className="rounded-lg bg-bg-elevated px-4 py-3 shadow-card">1. 记忆 — 口型、口诀、易错</li>
              <li className="rounded-lg bg-bg-elevated px-4 py-3 shadow-card">2. 书写 — 米字格描红 + 辨形</li>
              <li className="rounded-lg bg-bg-elevated px-4 py-3 shadow-card">3. 朗读 — 英式跟读单词</li>
            </ol>
            <Button type="button" className="w-full" size="xl" onClick={next}>
              开始记忆第一个音
            </Button>
          </div>
        ) : null}

        {step.type === "memory" ? (
          <MemoryStep
            phoneme={phoneme}
            onComplete={() => {
              markSkill(phoneme.id, "memory");
              setScore((s) => ({ ...s, memory: s.memory + 1 }));
              next();
            }}
          />
        ) : null}

        {step.type === "write" ? (
          <WriteStep
            phoneme={phoneme}
            onComplete={(correct, total) => {
              markSkill(phoneme.id, "write");
              setScore((s) => ({ ...s, write: s.write + correct / total }));
              next();
            }}
          />
        ) : null}

        {step.type === "speak" ? (
          <SpeakPanel
            phoneme={phoneme}
            examples={phoneme.examples}
            onComplete={() => {
              markSkill(phoneme.id, "speak");
              setScore((s) => ({ ...s, speak: s.speak + 1 }));
              next();
            }}
          />
        ) : null}

        {step.type === "quiz" ? (
          <QuizCard
            key={quiz[quizIndex]!.id}
            question={quiz[quizIndex]!}
            index={quizIndex}
            total={quiz.length}
            onResolved={(ok) => {
              recordQuiz(quiz[quizIndex]!.phonemeId, ok);
              const nextScore = {
                quizCorrect: score.quizCorrect + (ok ? 1 : 0),
                quizTotal: score.quizTotal + 1,
              };
              setScore((s) => ({ ...s, ...nextScore }));
              if (quizIndex + 1 >= quiz.length) {
                completeDay(day.day, {
                  memory: score.memory,
                  write: score.write,
                  speak: score.speak,
                  quizCorrect: nextScore.quizCorrect,
                  quizTotal: nextScore.quizTotal,
                });
                setStepIndex(STEPS.length - 1);
              } else {
                setQuizIndex(quizIndex + 1);
              }
            }}
          />
        ) : null}

        {step.type === "done" ? (
          <DoneView
            day={day}
            quizCorrect={completedDays[day.day]?.quizCorrect ?? score.quizCorrect}
            quizTotal={completedDays[day.day]?.quizTotal ?? score.quizTotal}
            streak={streak}
          />
        ) : null}
      </main>
    </div>
  );
}

function DoneView({
  day,
  quizCorrect,
  quizTotal,
  streak,
}: {
  day: CourseDay;
  quizCorrect: number;
  quizTotal: number;
  streak: number;
}) {
  const next = day.day < 24 ? day.day + 1 : null;
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Check className="size-7" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-semibold">第 {day.day} 天完成</h1>
        <p className="mt-2 text-sm text-muted">
          辨形 {quizCorrect}/{quizTotal || 6} · 连续 {streak} 天
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {day.phonemeIds.map((id) => {
          const p = getPhoneme(id)!;
          return (
            <div key={id} className="rounded-xl bg-bg-elevated py-5 shadow-card">
              <Ipa className="text-3xl">{p.ipa}</Ipa>
              <p className="mt-2 text-xs text-muted">{p.nameZh}</p>
            </div>
          );
        })}
      </div>
      {next ? (
        <p className="text-sm text-muted">明天：第 {next} 天，继续一对新音标。</p>
      ) : (
        <p className="text-sm text-muted">48 个 DJ 音标已经全部过了一遍。可以回音标表查漏补缺。</p>
      )}
      <div className="flex flex-col gap-2">
        <Button asChild size="lg" className="w-full">
          <Link to="/">回今日</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="w-full">
          <Link to="/chart">看音标表</Link>
        </Button>
      </div>
    </div>
  );
}
