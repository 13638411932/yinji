import { Link, createFileRoute } from "@tanstack/react-router";
import { Ipa } from "@/components/ipa";
import { COURSE, UNITS, isDayUnlocked } from "@/lib/curriculum";
import { getPhoneme } from "@/lib/phonemes";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/course")({ component: CoursePage });

function CoursePage() {
  const completedDays = useProgress((s) => s.completedDays);

  return (
    <main className="px-4 pb-10 pt-6 sm:px-6">
      <p className="text-xs font-medium tracking-wide text-muted">24 天入门</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">课程</h1>
      <p className="mt-2 max-w-md text-sm text-muted">
        每天一对音标，先对比再分开练。完成当天即可解锁下一天。
      </p>

      <div className="mt-8 space-y-10">
        {UNITS.map((unit) => (
          <section key={unit.id}>
            <h2 className="font-display text-lg font-semibold">{unit.label}</h2>
            <div className="mt-3 space-y-2">
              {COURSE.filter((d) => unit.days.includes(d.day)).map((d) => {
                const complete = Boolean(completedDays[d.day]);
                const unlocked = isDayUnlocked(d.day, completedDays);
                const a = getPhoneme(d.phonemeIds[0])!;
                const b = getPhoneme(d.phonemeIds[1])!;
                const inner = (
                  <div
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 shadow-card",
                      complete ? "bg-primary-soft" : "bg-bg-elevated",
                      !unlocked && "opacity-50",
                    )}
                  >
                    <span className="w-8 text-xs tabular-nums text-muted">{d.day}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg">{d.title}</p>
                      <p className="truncate text-xs text-muted">{d.focus}</p>
                    </div>
                    <div className="flex gap-2 font-ipa text-lg text-primary">
                      <Ipa>{a.ipa}</Ipa>
                      <Ipa>{b.ipa}</Ipa>
                    </div>
                  </div>
                );
                if (!unlocked) return <div key={d.day}>{inner}</div>;
                return (
                  <Link key={d.day} to="/practice/$day" params={{ day: String(d.day) }}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
