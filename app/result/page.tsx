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
    if (answers.length === 0) {
      router.replace("/"); // redirect if no quiz taken
    }
  }, [answers, router]);

  useEffect(() => {
    setIsMounted(true);

    // Show confetti for 3 seconds if perfect score
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
            headers: {
              "Content-Type": "application/json",
            },
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
    <div className="min-h-screen px-4 py-8 bg-gray-100 flex flex-col items-center">
      {isMounted && showConfetti && width > 0 && height > 0 && (
        <Confetti width={width} height={height} />
      )}

      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center text-green-700">
          🎉 Your Score: {score} / {answers.length}
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2">Question</th>
                <th className="border px-3 py-2">Your Answer</th>
                <th className="border px-3 py-2">Correct Answer</th>
                <th className="border px-3 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {answers.map((item, idx) => (
                <tr key={idx} className="bg-white even:bg-gray-50">
                  <td className="border px-3 py-2">
                    {decodeURIComponent(item.question)}
                  </td>
                  <td className="border px-3 py-2">{item.selected}</td>
                  <td className="border px-3 py-2">{item.correct}</td>
                  <td className="border px-3 py-2 text-center">
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
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition text-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
