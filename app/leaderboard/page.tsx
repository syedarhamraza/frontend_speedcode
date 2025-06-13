"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";

interface User {
  name: string;
  score: number;
}

export default function Leaderboard() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://backend-five-pied-88.vercel.app/api/leaderboard")
      .then((res) => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getCardStyles = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 border border-yellow-400";
      case 1:
        return "bg-gray-200 border border-gray-400";
      case 2:
        return "bg-amber-200 border border-amber-400";
      default:
        return "bg-white border border-gray-200";
    }
  };

  const getMedal = (index: number) => {
    return index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : "";
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">🏆 Leaderboard</h1>

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {data.map((user, index) => (
              <Card
                key={index}
                className={`hover:shadow-lg transition-shadow ${getCardStyles(
                  index
                )}`}
              >
                <CardContent className="flex items-center gap-4 py-4 px-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl font-bold w-6 text-gray-800"
                  >
                    {getMedal(index) || index + 1}
                  </motion.div>
                  <Avatar>
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="flex-1"
                  >
                    <div className="text-lg font-medium text-gray-900">
                      {user.name}
                    </div>
                  </motion.div>
                  <div className="text-right text-lg font-bold text-gray-800">
                    {user.score} pts
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
