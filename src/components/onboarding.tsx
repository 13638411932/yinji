import { Pencil, Volume2, BookOpen } from "lucide-react";
import { useState } from "react";
import { Mark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useProgress } from "@/lib/progress-store";

const PAGES = [
  {
    kicker: "DJ 音标学堂",
    title: "把 48 个音标写进手里",
    body: "中学用的 Daniel Jones 音标，不是美式 KK。每天一对，24 天走完整张表。",
  },
  {
    kicker: "每日三练",
    title: "记、写、读，缺一不可",
    body: "先用口诀和口型记住，再在米字格里描红辨形，最后跟英式发音朗读例词。",
  },
  {
    kicker: "从长短 i 开始",
    title: "sheep 不是 ship",
    body: "第一天就练中国学习者最容易混的一对。大约十二分钟，写好、读准、记住。",
  },
];

export function Onboarding() {
  const [page, setPage] = useState(0);
  const complete = useProgress((s) => s.completeOnboarding);
  const current = PAGES[page]!;

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-6 py-10">
      <div className="flex items-center gap-2">
        <Mark className="size-9" />
        <span className="font-display text-xl font-semibold">音迹</span>
      </div>
      <div className="flex flex-1 flex-col justify-center py-10">
        <p className="text-xs font-medium tracking-widest text-muted">{current.kicker}</p>
        <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-balance">
          {current.title}
        </h1>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-muted">{current.body}</p>
        {page === 1 ? (
          <ul className="mt-8 space-y-3">
            <Skill icon={BookOpen} name="记忆" desc="口型、口诀、易错对比" />
            <Skill icon={Pencil} name="书写" desc="米字格描红 + 辨形测验" />
            <Skill icon={Volume2} name="朗读" desc="英式跟读，可开麦克风" />
          </ul>
        ) : null}
      </div>
      <div className="flex gap-1.5 pb-6">
        {PAGES.map((_, i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i === page ? "bg-primary" : "bg-bg-subtle"}`} />
        ))}
      </div>
      {page < PAGES.length - 1 ? (
        <Button type="button" size="xl" className="w-full" onClick={() => setPage(page + 1)}>
          继续
        </Button>
      ) : (
        <Button type="button" size="xl" className="w-full" onClick={complete}>
          开始第 1 天
        </Button>
      )}
    </div>
  );
}

function Skill({
  icon: Icon,
  name,
  desc,
}: {
  icon: typeof Pencil;
  name: string;
  desc: string;
}) {
  return (
    <li className="flex items-start gap-3 rounded-xl bg-bg-elevated p-4 shadow-card">
      <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <span>
        <span className="block text-sm font-medium text-fg">{name}</span>
        <span className="mt-0.5 block text-sm text-muted">{desc}</span>
      </span>
    </li>
  );
}
