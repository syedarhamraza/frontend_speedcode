// components/QuestionCard.tsx

import React from "react";
import { Button } from "@/components/ui/button";

interface Props {
  question: string;
  answers: string[];
  onSelect: (answer: string) => void;
}

export default function QuestionCard({ question, answers, onSelect }: Props) {
  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all">
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mb-4">
        {question}
      </h2>
      <div className="grid gap-4">
        {answers.map((ans, i) => (
          <Button
            key={i}
            onClick={() => onSelect(ans)}
            className="w-full justify-start text-base sm:text-lg font-medium px-5 py-3 rounded-xl shadow-sm hover:scale-[1.02] transition-transform"
            variant="outline"
          >
            {ans}
          </Button>
        ))}
      </div>
    </div>
  );
}
