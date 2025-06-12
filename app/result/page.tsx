"use client";
import { useQuiz } from "@/context/QuizContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResultPage() {
  const { answers, score } = useQuiz();
  const [submitted, setSubmitted] = useState(false);

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
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">
        Your Score: {score} / {answers.length}
      </h1>
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Question</th>
            <th className="border px-4 py-2">Your Answer</th>
            <th className="border px-4 py-2">Correct Answer</th>
            <th className="border px-4 py-2">Result</th>
          </tr>
        </thead>
        <tbody>
          {answers.map((item, idx) => (
            <tr key={idx} className="border">
              <td className="border px-4 py-2">
                {decodeURIComponent(item.question)}
              </td>
              <td className="border px-4 py-2">
                {decodeURIComponent(item.selected)}
              </td>
              <td className="border px-4 py-2">
                {decodeURIComponent(item.correct)}
              </td>
              <td className="border px-4 py-2">
                {item.selected === item.correct ? "✅" : "❌"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
