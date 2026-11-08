import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Pencil, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Ipa } from "@/components/ipa";
import { MouthAnim, playPhonemeAlone } from "@/components/mouth-anim";
import { Button } from "@/components/ui/button";
import { COURSE, COURSE_LENGTH, getDay } from "@/lib/curriculum";
import { getPhoneme, PHONEMES } from "@/lib/phonemes";
import { completedCount, currentDay, liveStreak, useProgress } from "@/lib/progress-store";
import { todayKey } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const DEMO_IDS = ["iː", "æ", "uː", "θ", "ʃ", "ə"] as const;

function Home() {
  const completedDays = useProgress((s) => s.completedDays);
  const streak = liveStreak(
    useProgress((s) => s.streak),
    useProgress((s) => s.lastActiveDate),
  );
  const skills = useProgress((s) => s.skills);
  const dayNum = currentDay(completedDays);
  const day = getDay(dayNum)!;
  const pair = day.phonemeIds.map((id) => getPhoneme(id)!);
  const doneToday = Boolean(completedDays[dayNum]?.completedAt === todayKey());
  const allDone = completedCount(completedDays) >= COURSE_LENGTH;
  const doneCount = completedCount(completedDays);

  const [demoIndex, setDemoIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const demo = getPhoneme(DEMO_IDS[demoIndex]!)!;

  useEffect(() => {
    if (!autoPlay) return;
    const timeouts: number[] = [];
    const beat = () => {
      setPlaying(true);
      timeouts.push(window.setTimeout(() => setPlaying(false), 1200));
    };
    beat();
    const id = window.setInterval(() => {
      setDemoIndex((i) => (i + 1) % DEMO_IDS.length);
      beat();
    }, 2800);
    return () => {
      window.clearInterval(id);
      timeouts.forEach((t) => window.clearTimeout(t));
    };
  }, [autoPlay]);

  function playDemo(i: number) {
    const p = getPhoneme(DEMO_IDS[i])!;
    setAutoPlay(false);
    setDemoIndex(i);
    void playPhonemeAlone(p, setPlaying);
  }

  return (
    <main>
      <section className="grid items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16">
        <div>
          <p className="text-xs font-medium tracking-widest text-muted">DJ 音标自学站</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-balance lg:text-5xl">
            看口型，写音标，跟英式读
          </h1>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            中学 Daniel Jones 48 音标。正面看圆唇开合，侧面看舌位，声带和气流会跟着动——点音标即可对照自己的嘴。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/practice/$day" params={{ day: String(day.day) }}>
                {doneToday ? "再练今日" : "开始今日日课"}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/chart">浏览音标表</Link>
            </Button>
          </div>
          <p className="mt-4 text-xs tabular-nums text-faint">
            连续 {streak} 天 · 已完成 {doneCount}/{COURSE_LENGTH} 课
          </p>
        </div>

        <div>
          <MouthAnim key={demo.id} phoneme={demo} playing={playing} />
          <div className="mt-3 flex flex-wrap gap-1.5">
            {DEMO_IDS.map((id, i) => {
              const p = getPhoneme(id)!;
              const active = i === demoIndex;
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => playDemo(i)}
                  className={`min-h-11 rounded-md px-3 font-ipa text-sm ${
                    active ? "bg-primary text-primary-fg" : "bg-bg-elevated text-fg shadow-card"
                  }`}
                >
                  /{p.ipa}/
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-xs text-muted">
            正在演示 {demo.nameZh} · 点音标听音标本身的读音，例词 {demo.examples[0]!.word}
          </p>
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="grid gap-4 rounded-xl bg-bg-elevated px-5 py-5 shadow-card sm:grid-cols-3 sm:px-6">
          <AnimNote title="正面口型" body="圆唇或展唇、开口大小、牙齿和舌尖。" />
          <AnimNote title="侧面舌位" body="舌前或舌后、软腭升降。双元音会滑动。" />
          <AnimNote title="声带与气流" body="浊音振动，摩擦、爆破、鼻音各有动画。" />
        </div>
      </section>

      <section className="mt-8 px-4 sm:px-6">
        <div className="grid gap-3 md:grid-cols-3">
          <Feature icon={BookOpen} title="记忆" body="口诀、汉语近似、对比易错。看清舌位再开口。" />
          <Feature icon={Pencil} title="书写" body="米字格描红，再辨形近音标。写对才记得住。" />
          <Feature icon={Volume2} title="朗读" body="英式跟读，口型动画同步。能开麦克风就核对。" />
        </div>
      </section>

      <section className="mt-12 px-4 sm:px-6 lg:mt-16">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-medium tracking-wide text-muted">
              {allDone ? "课程已走完" : `第 ${day.day} / ${COURSE_LENGTH} 天 · ${day.unit}`}
            </p>
            <h2 className="mt-1 font-display text-2xl font-semibold tracking-tight">{day.title}</h2>
            <p className="mt-2 max-w-lg text-sm text-muted">{day.tip}</p>
          </div>
          <Button asChild variant="soft">
            <Link to="/course">全部课程</Link>
          </Button>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 lg:max-w-xl">
          {pair.map((p) => {
            const ticks = [skills[p.id]?.memory, skills[p.id]?.write, skills[p.id]?.speak].filter(Boolean).length;
            return (
              <Link
                key={p.id}
                to="/phoneme/$id"
                params={{ id: p.id }}
                className="rounded-xl bg-bg-elevated px-3 py-6 text-center shadow-card transition-[box-shadow] duration-150 hover:shadow-card-hover"
              >
                <Ipa className="text-5xl leading-none">{p.ipa}</Ipa>
                <p className="mt-3 text-xs text-muted">{p.nameZh}</p>
                <p className="mt-1 text-xs text-faint">{ticks}/3 项</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-12 px-4 pb-6 sm:px-6 lg:mt-16">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-2xl font-semibold">48 音标</h2>
          <Link to="/chart" className="text-sm text-primary">
            打开全表
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-6 gap-1.5 sm:grid-cols-8 md:grid-cols-12">
          {PHONEMES.map((p) => (
            <Link
              key={p.id}
              to="/phoneme/$id"
              params={{ id: p.id }}
              className="flex h-11 items-center justify-center rounded-sm bg-bg-elevated font-ipa text-sm shadow-card hover:bg-primary-soft"
            >
              {p.ipa}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 px-4 pb-12 sm:px-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-medium">24 日课</h2>
          <p className="text-xs tabular-nums text-muted">
            {doneCount}/{COURSE_LENGTH}
          </p>
        </div>
        <div className="mt-3 grid grid-cols-8 gap-1.5 md:grid-cols-12">
          {COURSE.map((d) => {
            const complete = Boolean(completedDays[d.day]);
            const current = d.day === day.day && !allDone;
            const cls = `flex h-9 items-center justify-center rounded-sm text-xs tabular-nums ${
              complete
                ? "bg-primary text-primary-fg"
                : current
                  ? "bg-primary-soft text-primary"
                  : "bg-bg-subtle text-faint"
            }`;
            return complete || d.day === day.day ? (
              <Link key={d.day} to="/practice/$day" params={{ day: String(d.day) }} className={cls}>
                {d.day}
              </Link>
            ) : (
              <span key={d.day} className={cls}>
                {d.day}
              </span>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function AnimNote({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-wide text-muted">{title}</p>
      <p className="mt-1 text-sm leading-relaxed text-fg">{body}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Pencil;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-bg-elevated p-5 shadow-card">
      <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
        <Icon className="size-4" />
      </span>
      <h3 className="mt-3 font-medium">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
