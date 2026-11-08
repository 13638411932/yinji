import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Ipa } from "@/components/ipa";
import { VowelChart } from "@/components/vowel-chart";
import { groupedPhonemes, phonemesOfKind, type PhonemeKind } from "@/lib/phonemes";
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
  const skills = useProgress((s) => s.skills);

  return (
    <main className="px-4 pb-10 pt-6 sm:px-6">
      <p className="text-xs font-medium tracking-wide text-muted">Daniel Jones · 48</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">音标表</h1>
      <p className="mt-2 max-w-md text-sm text-muted">按中学 DJ 表排列。点进任意音标，看写法、口型和例词。</p>

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
                    <Link
                      key={p.id}
                      to="/phoneme/$id"
                      params={{ id: p.id }}
                      className={cn(
                        "flex min-h-20 flex-col items-center justify-center rounded-lg bg-bg-elevated px-1 py-3 shadow-card",
                        mastered && "ring-1 ring-primary/30",
                      )}
                    >
                      <Ipa className="text-2xl leading-none">{p.ipa}</Ipa>
                      <span className="mt-2 text-xs leading-none text-faint">
                        {mastery > 0 ? `${mastery}%` : p.groupZh}
                      </span>
                    </Link>
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
