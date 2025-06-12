"use client";
import { useQuiz } from "@/context/QuizContext";

export default function ResultPage() {
  const { answers, score } = useQuiz();

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
