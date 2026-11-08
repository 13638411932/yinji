import { Check, Mic, RefreshCw, Turtle, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { MouthAnim, playWithMouth } from "@/components/mouth-anim";
import { Button } from "@/components/ui/button";
import type { ExampleWord, Phoneme } from "@/lib/phonemes";
import { canRecognize, matchesWord, recognizeOnce, stopSpeaking } from "@/lib/speech";
import { cn } from "@/lib/utils";

type WordState = "idle" | "listening" | "pass" | "retry" | "self";

export function SpeakPanel({
  phoneme,
  examples,
  onComplete,
}: {
  phoneme: Phoneme;
  examples: ExampleWord[];
  onComplete: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [state, setState] = useState<WordState>("idle");
  const [heard, setHeard] = useState("");
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [playing, setPlaying] = useState(false);
  const rec = canRecognize();
  const word = examples[index]!;
  const passed = Object.values(done).filter(Boolean).length;

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  async function listen(rate: number) {
    setState("idle");
    await playWithMouth(phoneme, word.word, rate, setPlaying);
  }

  async function shadow() {
    if (!rec) {
      setDone((d) => ({ ...d, [index]: true }));
      setState("self");
      return;
    }
    setHeard("");
    setState("listening");
    setPlaying(true);
    try {
      const transcript = await recognizeOnce();
      setHeard(transcript);
      const ok = matchesWord(transcript, word.word);
      setDone((d) => ({ ...d, [index]: ok || d[index] }));
      setState(ok ? "pass" : "retry");
    } catch {
      setState("retry");
    } finally {
      setPlaying(false);
    }
  }

  function markSelf() {
    setDone((d) => ({ ...d, [index]: true }));
    setState("self");
  }

  function nextWord() {
    if (index < examples.length - 1) {
      setIndex(index + 1);
      setState("idle");
      setHeard("");
      setPlaying(false);
    }
  }

  const canFinish = passed >= Math.min(2, examples.length);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <MouthAnim key={phoneme.id} phoneme={phoneme} playing={playing || state === "listening"} />
        <div className="flex flex-col justify-center rounded-xl bg-bg-elevated px-5 py-8 text-center shadow-card">
          <p className="font-ipa text-5xl font-semibold tracking-tight text-fg">{word.word}</p>
          <p className="mt-3 font-ipa text-xl text-primary">/{word.ipa}/</p>
          <p className="mt-2 text-sm text-muted">{word.zh}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button type="button" variant="soft" onClick={() => void listen(0.86)}>
          <Volume2 className="size-4" />
          听英式
        </Button>
        <Button type="button" variant="outline" onClick={() => void listen(0.58)}>
          <Turtle className="size-4" />
          慢速
        </Button>
      </div>

      <Button type="button" className="w-full" size="lg" onClick={() => void shadow()}>
        <Mic className="size-4" />
        {state === "listening" ? "正在听你读…" : rec ? "跟读" : "我已跟读"}
      </Button>

      {state === "listening" ? (
        <p className="text-center text-sm text-primary">请对着麦克风读这个单词，对照口型</p>
      ) : null}
      {state === "pass" ? (
        <p className="flex items-center justify-center gap-1.5 text-sm text-primary">
          <Check className="size-4" />
          听起来对了{heard ? ` · ${heard}` : ""}
        </p>
      ) : null}
      {state === "retry" ? (
        <div className="space-y-2 text-center">
          <p className="text-sm text-muted">{heard ? `听到的是「${heard}」` : "没听清，再试一次，或标记已跟读。"}</p>
          <button type="button" className="text-sm text-primary underline-offset-2 hover:underline" onClick={markSelf}>
            我已跟读
          </button>
        </div>
      ) : null}
      {state === "self" ? <p className="text-center text-sm text-muted">已记下这一遍跟读。</p> : null}

      <div className="flex items-center gap-2">
        {examples.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setIndex(i);
              setState("idle");
              setHeard("");
              setPlaying(false);
            }}
            className={cn(
              "h-2 flex-1 rounded-full",
              i === index ? "bg-primary" : done[i] ? "bg-primary/40" : "bg-bg-subtle",
            )}
            aria-label={`单词 ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex gap-2">
        {index < examples.length - 1 ? (
          <Button type="button" variant="outline" className="flex-1" onClick={nextWord}>
            <RefreshCw className="size-4" />
            下一个词
          </Button>
        ) : null}
        <Button type="button" className="flex-1" disabled={!canFinish} onClick={onComplete}>
          完成朗读
        </Button>
      </div>
    </div>
  );
}
