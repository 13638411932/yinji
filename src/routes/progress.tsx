import { Link, createFileRoute } from "@tanstack/react-router";
import { Ipa } from "@/components/ipa";
import { Button } from "@/components/ui/button";
import { COURSE_LENGTH } from "@/lib/curriculum";
import { PHONEMES } from "@/lib/phonemes";
import {
  completedCount,
  liveStreak,
  phonemeMastery,
  useProgress,
} from "@/lib/progress-store";

export const Route = createFileRoute("/progress")({ component: ProgressPage });

function ProgressPage() {
  const completedDays = useProgress((s) => s.completedDays);
  const streak = liveStreak(
    useProgress((s) => s.streak),
    useProgress((s) => s.lastActiveDate),
  );
  const skills = useProgress((s) => s.skills);
  const startedOn = useProgress((s) => s.startedOn);
  const reset = useProgress((s) => s.resetProgress);
  const done = completedCount(completedDays);
  const weak = [...PHONEMES]
    .map((p) => ({ p, m: phonemeMastery(skills[p.id]) }))
    .filter((x) => x.m > 0 && x.m < 80)
    .sort((a, b) => a.m - b.m)
    .slice(0, 6);

  return (
    <main className="px-4 pb-10 pt-6 sm:px-6">
      <p className="text-xs font-medium tracking-wide text-muted">练习记录</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">进度</h1>

      <div className="mt-6 grid grid-cols-3 gap-2">
        <Stat label="连续" value={`${streak} 天`} />
        <Stat label="日课" value={`${done}/${COURSE_LENGTH}`} />
        <Stat label="开课" value={startedOn ?? "—"} />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-medium">掌握热图</h2>
        <div className="mt-3 grid grid-cols-8 gap-1.5">
          {PHONEMES.map((p) => {
            const m = phonemeMastery(skills[p.id]);
            const bg =
              m >= 80 ? "bg-primary text-primary-fg" : m >= 40 ? "bg-primary-soft text-primary" : "bg-bg-subtle text-faint";
            return (
              <Link
                key={p.id}
                to="/phoneme/$id"
                params={{ id: p.id }}
                title={`${p.ipa} ${m}%`}
                className={`flex h-10 items-center justify-center rounded-sm font-ipa text-xs ${bg}`}
              >
                {p.ipa}
              </Link>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-faint">颜色越深越熟。点进去补练。</p>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-medium">需要回看</h2>
        {weak.length === 0 ? (
          <p className="mt-3 text-sm text-muted">还没有薄弱项。完成几日课后，这里会列出正确率偏低的音。</p>
        ) : (
          <div className="mt-3 space-y-2">
            {weak.map(({ p, m }) => (
              <Link
                key={p.id}
                to="/phoneme/$id"
                params={{ id: p.id }}
                className="flex items-center justify-between rounded-xl bg-bg-elevated px-4 py-3 shadow-card"
              >
                <span>
                  <Ipa className="text-xl">{p.ipa}</Ipa>
                  <span className="ml-2 text-sm text-muted">{p.nameZh}</span>
                </span>
                <span className="text-xs tabular-nums text-muted">{m}%</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 rounded-xl bg-bg-elevated p-4 shadow-card">
        <p className="text-sm font-medium">重新开始</p>
        <p className="mt-1 text-xs text-muted">清除本机练习记录，课程从第 1 天再走。不可恢复。</p>
        <Button type="button" variant="outline" className="mt-3" onClick={reset}>
          清空进度
        </Button>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-bg-elevated px-3 py-4 text-center shadow-card">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 font-display text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
