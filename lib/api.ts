// lib/api.ts

export interface Question {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface Category {
  id: number;
  name: string;
}

interface FetchQuestionsParams {
  amount: string;
  category: string;
  difficulty: string;
  token: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch("https://opentdb.com/api_category.php");
  const data = await res.json();
  return data.trivia_categories;
}

export async function getQuestions({
  amount,
  category,
  difficulty,
  token,
}: FetchQuestionsParams): Promise<Question[]> {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${difficulty}&type=multiple&token=${token}`
  );
  const data = await res.json();
  return data.results;
}
