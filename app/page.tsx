"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCategories, generateQuiz } from "@/lib/api";
import { useQuizStore } from "@/lib/quizStore";
import { Category, QuizSession } from "@/types";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  X,
  Loader2,
  Newspaper,
  Brain,
  Trophy,
  ArrowRight,
} from "lucide-react";

const DIFFICULTIES = [
  {
    label: "Easy",
    description: "Broad strokes, big headlines",
    icon: Newspaper,
    questionCount: "5 questions",
    timeEstimate: "~3 min",
    badge: "Good start",
    badgeVariant: "secondary" as const,
  },
  {
    label: "Medium",
    description: "Details matter here",
    icon: Brain,
    questionCount: "8 questions",
    timeEstimate: "~5 min",
    badge: "Most popular",
    badgeVariant: "default" as const,
  },
  {
    label: "Hard",
    description: "You really read the news",
    icon: Trophy,
    questionCount: "10 questions",
    timeEstimate: "~8 min",
    badge: "Expert",
    badgeVariant: "destructive" as const,
  },
];

export default function HomePage() {
  const router = useRouter();
  const { setCurrentSession, setLoading, setError, error } = useQuizStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null,
  );
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoadingCategories(true);
        setError(null);
        const data = await getCategories();
        setCategories(data);
      } catch {
        setError({ message: "Failed to load categories. Please try again." });
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [setError]);

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleStartQuiz = async () => {
    if (!selectedCategories.length || !selectedDifficulty) return;
    try {
      setIsGeneratingQuiz(true);
      setLoading(true, "Generating your quiz...");
      setError(null);
      const rawQuiz: any = await generateQuiz(
        selectedCategories,
        selectedDifficulty.toLowerCase(),
      );
      const transformedQuestions = rawQuiz.questions.map(
        (q: any, index: number) => ({
          id: String(index),
          text: q.question,
          options: q.options,
          correctAnswer: q.answer,
          explanation: "",
        }),
      );
      const session: QuizSession = {
        id: String(rawQuiz.id ?? ""),
        categoryId: selectedCategories.join(","),
        difficulty: rawQuiz.difficulty ?? selectedDifficulty.toLowerCase(),
        questions: transformedQuestions,
        currentQuestionIndex: 0,
        answers: Array(transformedQuestions.length).fill(null),
        score: 0,
        completed: false,
        createdAt: rawQuiz.created_at ?? new Date().toISOString(),
      };
      setCurrentSession(session);
      setLoading(false);
      router.push("/quiz");
    } catch {
      setError({ message: "Failed to generate quiz. Please try again." });
      setLoading(false);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const canStart =
    selectedCategories.length > 0 && selectedDifficulty && !isGeneratingQuiz;

  return (
    <div className="min-h-screen">
     

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b flex flex-col justify-center">
        {/* decorative ruled lines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 32px)",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6  pt-12">
          {/* dateline */}
          {/* <div className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase mb-6">
            <Clock className="h-3 w-3" />
            <span>Daily Edition · Fresh from today's press</span>
          </div> */}

          <h1
            className="font-serif text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] mb-6"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            How well did you
            
            <span className="italic"> read the news </span>
             today?
          </h1>

          <p className="text-base leading-relaxed  mb-8">
            Questions generated fresh from real articles — Times of India, The
            Hindu, Indian Express and more. Pick your topics, set your
            difficulty, and find out how closely you were paying attention.
          </p>

          {/* source strip */}
          {/* <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="text-[11px] font-mono uppercase tracking-widest">
              Sources:
            </span>
            {SOURCE_OUTLETS.map((outlet) => (
              <span
                key={outlet}
                className="text-[11px] font-medium border rounded-full px-2.5 py-0.5"
              >
                {outlet}
              </span>
            ))}
          </div> */}
        </div>
      </div>

      {/* ── How it works ─────────────────────────────────────────── */}
      {/* <div className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-10">
          <p className="text-[11px] font-mono tracking-widest uppercase mb-6">
            How it works
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {HOW_IT_WORKS.map(({ step, icon: Icon, title, description }) => (
              <div key={step} className="flex flex-col gap-2">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-[11px] font-mono leading-none pt-0.5">
                    {step}
                  </span>
                  <Icon className="h-4 w-4 shrink-0" />
                </div>
                <p className="text-sm font-semibold leading-tight">
                  {title}
                </p>
                <p className="text-xs leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* ── Main configurator ────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 ml-4 shrink-0"
                onClick={() => setError(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isLoadingCategories ? (
          <div className="flex items-center gap-2 text-sm py-8">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Loading categories…</span>
          </div>
        ) : (
          <>
            {/* ── Step 1: Categories ─────────────────────────────── */}
            <section>
              {/* <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-mono font-bold shrink-0 border">
                  1
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    Choose your topics
                  </p>
                  <p className="text-xs mt-0.5">
                    Select one or more categories
                  </p>
                </div>
                {selectedCategories.length > 0 && (
                  <span className="ml-auto text-xs font-mono border rounded-full px-2.5 py-0.5">
                    {selectedCategories.length} selected
                  </span>
                )}
              </div> */}

              <div className="flex flex-wrap gap-2.5">
                {categories.map((cat) => {
                  const id = String((cat as any).ID ?? (cat as any).id);
                  const name = (cat as any).Name ?? (cat as any).name;
                  const isSelected = selectedCategories.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleCategory(id)}
                      className={`
                        relative px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150
                        ${isSelected ? "ring-2 ring-primary" : ""}
                      `}
                    >
                      {name}
                      
                    </button>
                  );
                })}
              </div>
            </section>


            {/* ── Step 2: Difficulty ─────────────────────────────── */}
            <section>
              {/* <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center h-6 w-6 rounded-full text-[11px] font-mono font-bold shrink-0 border">
                  2
                </span>
                <div>
                  <p className="text-sm font-semibold leading-tight">
                    Set the difficulty
                  </p>
                  <p className="text-xs mt-0.5">
                    How deep do you want to go?
                  </p>
                </div>
              </div> */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {DIFFICULTIES.map(
                  ({
                    label,
                    description,
                    icon: Icon,
                    badge,
                    badgeVariant,
                  }) => {
                    const isSelected = selectedDifficulty === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setSelectedDifficulty(label)}
                        className={`
                          group relative text-left p-3 rounded-xl border-2 transition-all duration-150
                          ${isSelected ? "ring-2 ring-primary" : "hover:shadow-sm"}
                        `}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <Icon
                            className={`h-5 w-5 ${!isSelected ? "opacity-60 group-hover:opacity-90" : ""} transition-opacity`}
                          />
                          <Badge
                            variant={badgeVariant}
                            className="text-[10px] py-0 h-4"
                          >
                            {badge}
                          </Badge>
                        </div>
                        <p className="font-bold text-sm mb-1">
                          {label}
                        </p>
                        <p className="text-xs leading-snug ">
                          {description}
                        </p>
                       
                      </button>
                    );
                  },
                )}
              </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────── */}
            <div className="pt-2">
              {/* Selection summary */}
        

              <Button
                onClick={handleStartQuiz}
                disabled={!canStart}
                size="lg"
                className="w-full text-base font-semibold tracking-wide rounded-xl transition-all"
              >
                {isGeneratingQuiz ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating your quiz…
                  </>
                ) : (
                  <>
                    Start quiz
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="mt-6  flex justify-center">
                <Button variant="outline"  className="w-full"  asChild>
                  <Link href="/about">Why Daily Brief? </Link>
                </Button>
              </div>

              {/* {!canStart && !isGeneratingQuiz && (
                <p className="text-center text-xs mt-3">
                  {!selectedCategories.length
                    ? "Select at least one category above"
                    : "Select a difficulty to continue"}
                </p>
              )} */}
            </div>

            {/* ── Footer note ────────────────────────────────────── */}
            {/* <div className="border-t pt-8 pb-2">
              <p className="text-xs text-center leading-relaxed max-w-md mx-auto">
                Questions are AI-generated from real news articles published
                today. Accuracy reflects the source material. This is not
                affiliated with any of the mentioned publications.
              </p>
            </div> */}
          </>
        )}
      </main>
    </div>
  );
}
