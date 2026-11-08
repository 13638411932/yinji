import { Link, createFileRoute } from "@tanstack/react-router";
import { PracticeSession } from "@/components/practice-session";
import { Button } from "@/components/ui/button";
import { COURSE_LENGTH, getDay, isDayUnlocked } from "@/lib/curriculum";
import { useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/practice/$day")({
  component: PracticePage,
});

function PracticePage() {
  const { day: dayParam } = Route.useParams();
  const dayNum = Number(dayParam);
  const day = getDay(dayNum);
  const completedDays = useProgress((s) => s.completedDays);

  if (!day || Number.isNaN(dayNum) || dayNum < 1 || dayNum > COURSE_LENGTH) {
    return (
      <main className="px-6 py-24 text-center">
        <p className="font-display text-2xl font-semibold">没有这一天</p>
        <Button asChild className="mt-6">
          <Link to="/course">回课程</Link>
        </Button>
      </main>
    );
  }

  if (!isDayUnlocked(day.day, completedDays)) {
    return (
      <main className="px-6 py-24 text-center">
        <p className="font-display text-2xl font-semibold">第 {day.day} 天还没解锁</p>
        <p className="mt-2 text-sm text-muted">按顺序完成前面的日课即可打开。</p>
        <Button asChild className="mt-6">
          <Link to="/course">回课程</Link>
        </Button>
      </main>
    );
  }

  return <PracticeSession day={day} />;
}
