"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">
            🏆 Student Leaderboard
          </h1>
          <p className="text-gray-600">
            Track and compare quiz scores of fellow coders!
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/leaderboard">
              <Button className=" bg-blue-600 text-white p-6 text-lg hover:bg-blue-700 transition cursor-pointer">
                View Leaderboard
              </Button>
            </Link>

            {user ? (
              // Show profile button or logout if logged in
              <>
                <Link href="/profile">
                  <Button className=" bg-green-600 text-white p-6 text-lg hover:bg-green-700 transition cursor-pointer">
                    Profile
                  </Button>
                </Link>
                {/* Optionally, add a logout button here */}
              </>
            ) : (
              // Show login if no user
              <Link href="/login">
                <Button className=" bg-gray-300 p-6 text-gray-800 text-lg hover:bg-gray-400 transition cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
