"use client";

import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/components/ProtectedRoute";

import QuizOptions from "@/components/QuizOptions";

export default function Home() {
  return (
    <>
      <ProtectedRoute>
        <Navbar />
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
          <div className="text-center space-y-6 max-w-xl">
            <h1 className="text-5xl font-bold text-gray-900">🎯 QuizSprint</h1>
            <p className="text-gray-600 text-lg">
              Test your knowledge, climb the leaderboard, and show your skills!
            </p>

            {/* Quiz Options Section */}
            <div className="mt-10">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Ready to Start a Quiz?
              </h2>
              <QuizOptions />
            </div>
          </div>
        </main>
      </ProtectedRoute>
    </>
  );
}
