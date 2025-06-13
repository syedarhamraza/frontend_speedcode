"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const register = async () => {
    const result = registerSchema.safeParse({ name, email, password });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-five-pied-88.vercel.app/api/register",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      if (!res.ok) {
        toast.error("Registration failed", {
          description: "Please try again with a different email.",
        });
        return;
      }

      const meRes = await fetch(
        "https://backend-five-pied-88.vercel.app/api/me",
        {
          credentials: "include",
        }
      );

      if (!meRes.ok) throw new Error("Failed to fetch user");

      const userData = await meRes.json();
      setUser(userData);

      toast.success("Account created!", {
        description: `Welcome, ${userData.name}`,
      });

      router.push("/quiz");
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-white text-black px-4 py-10">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold">Create an Account 📝</h1>
            <p className="text-sm text-gray-600">
              Sign up and start your quiz journey!
            </p>
          </div>

          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              className="w-full bg-black text-white hover:bg-gray-900 transition"
              onClick={register}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Register"
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Already have an account? You can log in instead.
          </p>
        </div>
      </main>
    </>
  );
}
