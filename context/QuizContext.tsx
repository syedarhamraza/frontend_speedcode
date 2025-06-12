"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

// Define the structure of a single question and an answer
interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

interface Answer {
  question: string;
  correct: string;
  selected: string;
}

interface QuizContextType {
  token: string;
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  answers: Answer[];
  setAnswers: React.Dispatch<React.SetStateAction<Answer[]>>;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    const getToken = async () => {
      const res = await fetch(
        "https://opentdb.com/api_token.php?command=request"
      );
      const data = await res.json();
      setToken(data.token);
    };
    getToken();
  }, []);

  return (
    <QuizContext.Provider
      value={{
        token,
        questions,
        setQuestions,
        currentStep,
        setCurrentStep,
        score,
        setScore,
        answers,
        setAnswers,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return context;
};
