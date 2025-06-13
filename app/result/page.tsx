"use client";

import { useQuiz } from "@/context/QuizContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const { answers, score } = useQuiz();
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { width, height } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    if (answers.length === 0) router.replace("/");
  }, [answers, router]);

  useEffect(() => {
    setIsMounted(true);
    if (score === answers.length && answers.length > 0) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [score, answers.length]);

  useEffect(() => {
    const submitScore = async () => {
      try {
        const res = await fetch(
          "https://backend-five-pied-88.vercel.app/api/submit",
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ score }),
          }
        );

        if (res.ok) {
          toast.success("Score submitted successfully!", {
            className: "text-base px-6 py-4",
            duration: 3000,
          });
          setSubmitted(true);
        } else {
          toast.error("Submission failed or already submitted", {
            className: "text-base px-6 py-4",
            duration: 5000,
          });
        }
      } catch {
        toast.error("Network error", {
          className: "text-base px-6 py-4",
          duration: 5000,
        });
      }
    };

    if (!submitted && answers.length > 0) {
      submitScore();
    }
  }, [score, answers, submitted]);

  return (
    <div className="min-h-screen bg-white text-black px-4 py-8 flex items-center justify-center">
      {isMounted && showConfetti && width > 0 && height > 0 && (
        <Confetti width={width} height={height} />
      )}

      <div className="w-full max-w-5xl bg-white border border-gray-200 p-6 md:p-10 rounded-2xl shadow-md space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            🎉 Your Score: <span className="text-green-600">{score}</span> /{" "}
            {answers.length}
          </h1>
          <p className="text-sm text-gray-600">
            Here&apos;s a breakdown of how you did on each question.
          </p>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="border px-4 py-3 text-left">Question</th>
                <th className="border px-4 py-3 text-left">Your Answer</th>
                <th className="border px-4 py-3 text-left">Correct Answer</th>
                <th className="border px-4 py-3 text-center">Result</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((item, idx) => (
                <tr key={idx} className="bg-white even:bg-gray-50">
                  <td className="border px-4 py-3">
                    {decodeURIComponent(item.question)}
                  </td>
                  <td className="border px-4 py-3">{item.selected}</td>
                  <td className="border px-4 py-3">{item.correct}</td>
                  <td className="border px-4 py-3 text-center">
                    {item.selected === item.correct ? "✅" : "❌"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center">
          <Link
            href="/"
            className="px-6 py-3 text-lg bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
