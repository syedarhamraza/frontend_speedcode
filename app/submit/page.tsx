"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

// Zod schema for score validation
const scoreSchema = z.object({
  score: z
    .number({
      invalid_type_error: "Score must be a number",
    })
    .int("Score must be an integer")
    .min(0, "Score cannot be negative")
    .max(100, "Score cannot be greater than 100"),
});

export default function SubmitScore() {
  const [score, setScore] = useState("");
  const [loading, setLoading] = useState(false);

  const submitScore = async () => {
    const parsedScore = Number(score);

    // Validate with Zod
    const result = scoreSchema.safeParse({ score: parsedScore });

    if (!result.success) {
      toast.error(result.error.errors[0].message, {
        className: "text-base px-6 py-4",
        duration: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "https://backend-five-pied-88.vercel.app/api/submit",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ score: parsedScore }),
        }
      );

      if (res.ok) {
        toast.success("Score submitted successfully!", {
          className: "text-base px-6 py-4",
          duration: 3000,
        });
        setScore("");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 bg-white p-6 shadow-md rounded">
          <h1 className="text-2xl font-semibold text-center">
            Submit Your Score
          </h1>
          <Input
            type="number"
            placeholder="Enter your quiz score"
            required
            value={score}
            onChange={(e) => setScore(e.target.value)}
            min={0}
            max={100}
          />
          <Button
            className="w-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer"
            onClick={submitScore}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    </>
  );
}
