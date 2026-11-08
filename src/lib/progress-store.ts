import { create } from "zustand";
import { persist } from "zustand/middleware";
import { COURSE_LENGTH, nextIncompleteDay } from "./curriculum";
import { todayKey, yesterdayKey } from "./utils";

export type SkillKey = "memory" | "write" | "speak";

export type DayScore = {
  completedAt: string;
  memory: number;
  write: number;
  speak: number;
  quizCorrect: number;
  quizTotal: number;
};

export type PhonemeSkill = {
  memory: boolean;
  write: boolean;
  speak: boolean;
  quizCorrect: number;
  quizTotal: number;
};

type SessionState = {
  day: number;
  step: number;
};

type ProgressState = {
  hydrated: boolean;
  onboarded: boolean;
  startedOn: string | null;
  streak: number;
  lastActiveDate: string | null;
  completedDays: Record<number, DayScore>;
  skills: Record<string, PhonemeSkill>;
  session: SessionState | null;
  setHydrated: () => void;
  completeOnboarding: () => void;
  setSession: (session: SessionState | null) => void;
  markSkill: (phonemeId: string, skill: SkillKey) => void;
  recordQuiz: (phonemeId: string, correct: boolean) => void;
  completeDay: (day: number, score: Omit<DayScore, "completedAt">) => void;
  resetProgress: () => void;
};

const emptySkill = (): PhonemeSkill => ({
  memory: false,
  write: false,
  speak: false,
  quizCorrect: 0,
  quizTotal: 0,
});

export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      onboarded: false,
      startedOn: null,
      streak: 0,
      lastActiveDate: null,
      completedDays: {},
      skills: {},
      session: null,
      setHydrated: () => set({ hydrated: true }),
      completeOnboarding: () =>
        set({
          onboarded: true,
          startedOn: get().startedOn ?? todayKey(),
        }),
      setSession: (session) => set({ session }),
      markSkill: (phonemeId, skill) => {
        const current = get().skills[phonemeId] ?? emptySkill();
        set({
          skills: {
            ...get().skills,
            [phonemeId]: { ...current, [skill]: true },
          },
        });
      },
      recordQuiz: (phonemeId, correct) => {
        const current = get().skills[phonemeId] ?? emptySkill();
        set({
          skills: {
            ...get().skills,
            [phonemeId]: {
              ...current,
              quizTotal: current.quizTotal + 1,
              quizCorrect: current.quizCorrect + (correct ? 1 : 0),
            },
          },
        });
      },
      completeDay: (day, score) => {
        const today = todayKey();
        const prev = get();
        let streak = prev.streak;
        if (prev.lastActiveDate === today) {
          streak = Math.max(streak, 1);
        } else if (prev.lastActiveDate === yesterdayKey()) {
          streak = streak + 1;
        } else {
          streak = 1;
        }
        set({
          completedDays: {
            ...prev.completedDays,
            [day]: { ...score, completedAt: today },
          },
          lastActiveDate: today,
          streak,
          session: null,
          startedOn: prev.startedOn ?? today,
        });
      },
      resetProgress: () =>
        set({
          onboarded: true,
          startedOn: todayKey(),
          streak: 0,
          lastActiveDate: null,
          completedDays: {},
          skills: {},
          session: null,
        }),
    }),
    {
      name: "yinji-progress-v1",
      skipHydration: true,
    },
  ),
);

export function liveStreak(streak: number, lastActiveDate: string | null): number {
  if (!lastActiveDate) return 0;
  const today = todayKey();
  if (lastActiveDate === today || lastActiveDate === yesterdayKey()) return streak;
  return 0;
}

export function currentDay(completedDays: Record<number, unknown>): number {
  return nextIncompleteDay(completedDays);
}

export function completedCount(completedDays: Record<number, unknown>): number {
  return Object.keys(completedDays).filter((k) => completedDays[Number(k)]).length;
}

export function coursePercent(completedDays: Record<number, unknown>): number {
  return Math.round((completedCount(completedDays) / COURSE_LENGTH) * 100);
}

export function phonemeMastery(skill: PhonemeSkill | undefined): number {
  if (!skill) return 0;
  const flags = Number(skill.memory) + Number(skill.write) + Number(skill.speak);
  const quiz = skill.quizTotal === 0 ? 0 : skill.quizCorrect / skill.quizTotal;
  return Math.round(((flags / 3) * 0.7 + quiz * 0.3) * 100);
}

export function isPhonemeMastered(skill: PhonemeSkill | undefined): boolean {
  return phonemeMastery(skill) >= 80;
}
