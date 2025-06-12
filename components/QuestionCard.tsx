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
    <div className="space-y-4 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold">{decodeURIComponent(question)}</h2>
      <div className="grid gap-3">
        {answers.map((ans, i) => (
          <Button
            key={i}
            onClick={() => onSelect(ans)}
            className="w-full text-left"
            variant="outline"
          >
            {decodeURIComponent(ans)}
          </Button>
        ))}
      </div>
    </div>
  );
}
