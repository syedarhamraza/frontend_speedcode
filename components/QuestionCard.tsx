// components/QuestionCard.tsx

import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  question: string;
  answers: string[];
  onSelect: (answer: string) => void;
  current: number;
  total: number;
  category: string;
}

export default function QuestionCard({
  question,
  answers,
  onSelect,
  current,
  total,
  category,
}: Props) {
  const progress = Math.round((current / total) * 100);

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-2xl shadow-md border border-zinc-200 dark:border-zinc-800 space-y-6">
      {/* Progress Bar */}
      <div>
        <Progress value={progress} className="h-2 rounded-full" />
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 text-center">
          Question {current} of {total}
        </p>
      </div>

      {/* Category */}
      <div className="text-center">
        <span className="inline-block text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 px-3 py-1 rounded-full uppercase tracking-wide">
          {category}
        </span>
      </div>

      {/* Question */}
      <h2 className="text-lg sm:text-xl font-semibold text-zinc-800 dark:text-zinc-100 text-center">
        {question}
      </h2>

      {/* Answer Options */}
      <div className="flex flex-col gap-4">
        {answers.map((ans, i) => (
          <Button
            key={i}
            onClick={() => onSelect(ans)}
            className="w-full justify-center text-base font-medium px-5 py-3 rounded-xl"
            variant="outline"
          >
            {ans}
          </Button>
        ))}
      </div>
    </div>
  );
}
