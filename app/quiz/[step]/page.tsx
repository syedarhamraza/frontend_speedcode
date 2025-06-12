"use client";

import { useRouter, useParams } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import QuestionCard from "@/components/QuestionCard";
import { shuffle } from "lodash";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import Spinner from "@/components/Spinner";

interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export default function QuizStep() {
  const { questions, setCurrentStep, score, setScore, answers, setAnswers } =
    useQuiz();

  const router = useRouter();
  const params = useParams();

  const index = parseInt(params.step as string, 10);
  const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]);

  useEffect(() => {
    const q = questions[index] as Question | undefined;
    if (!q) return;
    const choices = shuffle([q.correct_answer, ...q.incorrect_answers]);
    setShuffledAnswers(choices);
  }, [index, questions]);

  const handleSelect = (ans: string) => {
    const q = questions[index] as Question;
    setAnswers([
      ...answers,
      { question: q.question, correct: q.correct_answer, selected: ans },
    ]);
    if (ans === q.correct_answer) setScore(score + 1);
    if (index + 1 < questions.length) {
      setCurrentStep(index + 1);
      router.push(`/quiz/${index + 1}`);
    } else {
      router.push("/result");
    }
  };

  if (!questions[index]) return <Spinner />;

  return (
    <ProtectedRoute>
      <div className="p-6">
        <QuestionCard
          question={questions[index].question}
          answers={shuffledAnswers}
          onSelect={handleSelect}
        />
      </div>
    </ProtectedRoute>
  );
}
