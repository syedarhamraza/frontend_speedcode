"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-16 space-y-16 text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-2xl"
        >
          <h1 className="text-5xl font-extrabold text-gray-900">
            🎯 QuizSprint
          </h1>
          <p className="text-lg text-gray-600">
            Challenge yourself with quizzes, rise through the ranks, and track
            your journey.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/quiz">
              <Button className="bg-purple-600 text-white p-6 text-lg hover:bg-purple-700 transition cursor-pointer">
                Start Quiz
              </Button>
            </Link>
            <Link href="/leaderboard">
              <Button className=" bg-blue-600 text-white p-6 text-lg hover:bg-blue-700 transition cursor-pointer">
                View Leaderboard
              </Button>
            </Link>
          </div>

          {!user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 bg-yellow-100 text-yellow-800 p-4 rounded-lg shadow text-sm"
            >
              🎯 Want to track your scores and compete?{" "}
              <Link href="/register" className="underline font-medium">
                Create an account
              </Link>{" "}
              or{" "}
              <Link href="/login" className="underline font-medium">
                log in
              </Link>{" "}
              now.
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="italic text-gray-500 max-w-md"
        >
          &quot;Success is the sum of small efforts, repeated day in and day
          out.&quot; — Robert Collier
        </motion.div>
      </main>
    </>
  );
}
