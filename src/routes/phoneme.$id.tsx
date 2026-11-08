import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { ArrowLeft, Volume2 } from "lucide-react";
import { useState } from "react";
import { Ipa } from "@/components/ipa";
import { MouthAnim, playPhonemeAlone, playWithMouth } from "@/components/mouth-anim";
import { MouthGuide } from "@/components/mouth-guide";
import { SpeakPanel } from "@/components/speak-panel";
import { Button } from "@/components/ui/button";
import { VowelChart } from "@/components/vowel-chart";
import { WriteCanvas } from "@/components/write-canvas";
import { COURSE } from "@/lib/curriculum";
import { getPhoneme, kindLabel } from "@/lib/phonemes";
import { cn } from "@/lib/utils";
import { phonemeMastery, useProgress } from "@/lib/progress-store";

export const Route = createFileRoute("/phoneme/$id")({
  component: PhonemePage,
});

function PhonemePage() {
  const { id } = Route.useParams();
  const phoneme = getPhoneme(id);
  const skills = useProgress((s) => s.skills);
  const [spoken, setSpoken] = useState(false);
  const [playing, setPlaying] = useState(false);
  if (!phoneme) throw notFound();
  const mastery = phonemeMastery(skills[phoneme.id]);
  const day = COURSE.find((d) => d.phonemeIds.includes(phoneme.id));

  return (
    <main className="px-4 pb-12 pt-4 sm:px-6">
      <Button asChild variant="ghost" size="sm">
        <Link to="/chart">
          <ArrowLeft className="size-4" />
          音标表
        </Link>
      </Button>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-bg-elevated px-4 py-8 text-center shadow-card">
          <button
            type="button"
            aria-label={`播放 ${phoneme.nameZh} 的读音`}
            onClick={() => void playPhonemeAlone(phoneme, setPlaying)}
            className="mx-auto block rounded-xl px-3 py-1 transition active:scale-[0.97]"
          >
            <Ipa className={cn("text-7xl leading-none", playing && "text-primary")}>{phoneme.ipa}</Ipa>
          </button>
          <p className="mt-4 text-sm text-muted">
            {kindLabel(phoneme.kind)} · {phoneme.groupZh}
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold">{phoneme.nameZh}</h1>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Button type="button" onClick={() => void playPhonemeAlone(phoneme, setPlaying)}>
              <Volume2 className="size-4" />
              只听音标
            </Button>
            <Button
              type="button"
              variant="soft"
              onClick={() => void playWithMouth(phoneme, phoneme.examples[0]!.word, 0.8, setPlaying)}
            >
              <Volume2 className="size-4" />
              听例词 {phoneme.examples[0]!.word}
            </Button>
          </div>
          {mastery > 0 ? (
            <p className="mt-3 text-xs tabular-nums text-faint">掌握 {mastery}%</p>
          ) : null}
        </div>
        <MouthAnim key={phoneme.id} phoneme={phoneme} playing={playing} />
      </div>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium">记忆</h2>
        <MouthGuide phoneme={phoneme} />
        <Note title="口诀" body={phoneme.memory.mnemonic} />
        <Note title="汉语近似" body={phoneme.memory.chineseLike} />
        <Note title="易错" body={phoneme.memory.pitfall} />
        {phoneme.contrast ? (
          <div className="rounded-xl bg-primary-soft px-4 py-3 text-sm text-primary">
            对比 /{phoneme.contrast.with}/：{phoneme.contrast.tip}
          </div>
        ) : null}
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium">书写</h2>
        <div className="rounded-xl bg-bg-elevated p-4 shadow-card">
          <p className="text-sm leading-relaxed">{phoneme.writing.strokes}</p>
          <p className="mt-2 text-sm text-muted">{phoneme.writing.hint}</p>
        </div>
        <WriteCanvas glyph={phoneme.ipa} />
      </section>

      <section className="mt-8 space-y-3">
        <h2 className="text-sm font-medium">朗读</h2>
        <SpeakPanel phoneme={phoneme} examples={phoneme.examples} onComplete={() => setSpoken(true)} />
        {spoken ? <p className="text-sm text-primary">这一组已经跟读过了。</p> : null}
      </section>

      {phoneme.kind === "monophthong" ? (
        <section className="mt-8">
          <VowelChart activeId={phoneme.id} />
        </section>
      ) : null}

      {day ? (
        <Button asChild size="lg" className="mt-10 w-full md:w-auto">
          <Link to="/practice/$day" params={{ day: String(day.day) }}>
            去第 {day.day} 天课程
          </Link>
        </Button>
      ) : null}
    </main>
  );
}

function Note({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl bg-bg-elevated p-4 shadow-card">
      <p className="text-xs font-medium tracking-wide text-muted">{title}</p>
      <p className="mt-1.5 text-sm leading-relaxed">{body}</p>
    </div>
  );
}
