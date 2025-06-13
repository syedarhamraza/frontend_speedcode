"use client";

import { useEffect, useState } from "react";
import { getCategories, getQuestions } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/context/QuizContext";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Category {
  id: number;
  name: string;
}

export default function QuizOptions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState("9"); // General Knowledge default
  const [difficulty, setDifficulty] = useState("easy");
  const [amount, setAmount] = useState("5");

  const { token, setQuestions, setCurrentStep, setScore, setAnswers } =
    useQuiz();
  const { user } = useUser();
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

    setQuestions(questions);
    setCurrentStep(0);
    setScore(0);
    setAnswers([]);

    router.push("/quiz/0");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center  px-4">
        <div className="bg-white border border-gray-300 p-6 rounded-lg shadow-md text-center max-w-md w-full space-y-4">
          <h2 className="text-2xl font-semibold text-gray-800">Hold on!</h2>
          <p className="text-gray-600">
            You need to log in before starting a quiz.
          </p>
          <Link href="/login">
            <Button className="w-full bg-black text-white hover:bg-gray-900 transition">
              Login to Start
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex items-center justify-center  px-4 py-12 text-black">
      <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-md p-6 sm:p-8 space-y-6">
        <div className="space-y-1 text-center">
          <h2 className="text-3xl font-bold">Customize Your Quiz</h2>
          <p className="text-gray-600 text-sm">
            Choose what you want to be quizzed on and let’s get started!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Select Category
            </label>
            <select
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {decodeURIComponent(cat.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Difficulty Level
            </label>
            <select
              onChange={(e) => setDifficulty(e.target.value)}
              value={difficulty}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-700 font-medium block mb-1">
              Number of Questions
            </label>
            <select
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
              className="w-full p-2 border border-gray-300 rounded"
            >
              {[5, 10, 15].map((n) => (
                <option key={n} value={n.toString()}>
                  {n} Questions
                </option>
              ))}
            </select>
          </div>
        </div>

        <Button
          onClick={handleStart}
          className="w-full bg-black text-white hover:bg-gray-900 transition"
        >
          Start Quiz
        </Button>

        <p className="text-xs text-center text-gray-500">
          Learn, challenge yourself, and track your score
        </p>
      </div>
    </main>
  );
}
