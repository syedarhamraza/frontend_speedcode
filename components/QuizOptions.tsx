"use client";

import { useEffect, useState } from "react";
import { getCategories, getQuestions } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { Button } from "@/components/ui/button";

interface Category {
  id: number;
  name: string;
}

export default function QuizOptions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("9"); // General Knowledge
  const [difficulty, setDifficulty] = useState("easy");
  const [amount, setAmount] = useState("5");

  const { token, setQuestions, setCurrentStep, setScore, setAnswers } =
    useQuiz();
  const router = useRouter();

  useEffect(() => {
    const loadCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  const handleStart = async () => {
    const questions = await getQuestions({
      amount,
      category,
      difficulty,
      token,
    });

    // Reset state
    setQuestions(questions);
    setCurrentStep(0);
    setScore(0);
    setAnswers([]);

    router.push("/quiz/0");
  };

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <select
        onChange={(e) => setCategory(e.target.value)}
        value={category}
        className="w-full p-2 border rounded"
      >
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {decodeURIComponent(cat.name)}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setDifficulty(e.target.value)}
        value={difficulty}
        className="w-full p-2 border rounded"
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <select
        onChange={(e) => setAmount(e.target.value)}
        value={amount}
        className="w-full p-2 border rounded"
      >
        {[5, 10, 15].map((n) => (
          <option key={n} value={n.toString()}>
            {n} Questions
          </option>
        ))}
      </select>

      <Button onClick={handleStart} className="w-full">
        Start Quiz
      </Button>
    </div>
  );
}
