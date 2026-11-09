import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronRight, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";
import { Ipa } from "@/components/ipa";
import { playPhonemeAlone } from "@/components/mouth-anim";
import { playPhonemeClip, stopSpeaking } from "@/lib/speech";
import { VowelChart } from "@/components/vowel-chart";
import { PHONEMES, groupedPhonemes, phonemesOfKind, type PhonemeKind } from "@/lib/phonemes";
import { isPhonemeMastered, phonemeMastery, useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chart")({ component: ChartPage });

const TABS: { id: PhonemeKind | "all"; label: string }[] = [
  { id: "all", label: "全表" },
  { id: "monophthong", label: "单元音" },
  { id: "diphthong", label: "双元音" },
  { id: "consonant", label: "辅音" },
];

function ChartPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sweepIndex, setSweepIndex] = useState<number | null>(null);
  const sweepAbort = useRef(false);
  const skills = useProgress((s) => s.skills);

  /** 连播 48 个音标：一条"录音带"，方便一次性听完挑错。 */
  async function sweepAll() {
    if (sweepIndex !== null) {
      sweepAbort.current = true;
      stopSpeaking();
      setSweepIndex(null);
      return;
    }
    sweepAbort.current = false;
    const list = PHONEMES;
    for (let i = 0; i < list.length; i += 1) {
      if (sweepAbort.current) break;
      const p = list[i]!;
      setSweepIndex(i);
      const rate = p.vowel?.length === "short" ? 1.35 : 1;
      await playPhonemeClip(p.id, rate);
      if (sweepAbort.current) break;
      await new Promise((r) => window.setTimeout(r, 420));
    }
    sweepAbort.current = false;
    setSweepIndex(null);
  }

  return (
    <main className="px-4 pb-10 pt-6 sm:px-6">
      <p className="text-xs font-medium tracking-wide text-muted">Daniel Jones · 48</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">音标表</h1>
      <p className="mt-2 max-w-md text-sm text-muted">按中学 DJ 表排列。<strong className="font-medium text-fg">点音标直接听读音</strong>，点右上角箭头看写法、口型和例词。</p>

      <button
        type="button"
        onClick={() => void sweepAll()}
        className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg"
      >
        {sweepIndex === null ? <Play className="size-4" /> : <Pause className="size-4" />}
        {sweepIndex === null
          ? "连播全部 48 个"
          : `停止（${String(sweepIndex + 1)}/${String(PHONEMES.length)}）`}
      </button>

      <div className="mt-5 flex gap-1 rounded-lg bg-bg-subtle p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "h-9 flex-1 rounded-md text-sm font-medium",
              tab === t.id ? "bg-bg-elevated text-fg shadow-card" : "text-muted",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "monophthong" || tab === "all" ? (
        <div className="mt-6">
          <VowelChart />
        </div>
      ) : null}

      <div className="mt-8 space-y-8">
        {(tab === "all" ? groupedPhonemes() : groupedPhonemes().filter((g) => g.items[0]?.kind === tab)).map(
          (group) => (
            <section key={group.group}>
              <h2 className="text-xs font-medium tracking-wide text-muted">{group.group}</h2>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {group.items.map((p) => {
                  const mastered = isPhonemeMastered(skills[p.id]);
                  const mastery = phonemeMastery(skills[p.id]);
                  return (
                    <div key={p.id} className="relative">
                      <button
                        type="button"
                        aria-label={`播放 ${p.nameZh} 的读音`}
                        onClick={() => void playPhonemeAlone(p, (v) => setPlayingId(v ? p.id : null))}
                        className={cn(
                          "flex min-h-20 w-full flex-col items-center justify-center rounded-lg bg-bg-elevated px-1 py-3 shadow-card transition active:scale-[0.97]",
                          mastered && "ring-1 ring-primary/30",
                          playingId === p.id && "ring-2 ring-primary",
                        )}
                      >
                        <Ipa className="text-2xl leading-none">{p.ipa}</Ipa>
                        <span className="mt-2 text-xs leading-none text-faint">
                          {mastery > 0 ? `${mastery}%` : p.groupZh}
                        </span>
                      </button>
                      <Link
                        to="/phoneme/$id"
                        params={{ id: p.id }}
                        aria-label={`查看 ${p.nameZh} 的写法与口型`}
                        className="absolute right-0.5 top-0.5 flex size-7 items-center justify-center rounded-md text-faint hover:text-fg"
                      >
                        <ChevronRight className="size-4" />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </section>
          ),
        )}
      </div>

      {tab !== "all" ? (
        <p className="mt-8 text-xs text-faint">
          本栏 {phonemesOfKind(tab).length} 个
          {tab === "monophthong" ? "单元音" : tab === "diphthong" ? "双元音" : "辅音"}
        </p>
      ) : null}
      <p className="mt-6 text-xs leading-relaxed text-faint">
        音标单音录音来自 Wikimedia Commons 的 IPA 音频（CC BY-SA）；
        双元音与塞擦音由两段真实录音顺序播放，用来演示滑动过程。
      </p>
    </main>
  );
}
