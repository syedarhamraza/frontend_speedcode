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

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser();

  const login = async () => {
    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-five-pied-88.vercel.app/api/login",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe }),
        }
      );

      if (!res.ok) {
        toast.error("Login failed", {
          description: "Please check your email and password.",
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

      toast.success("Login successful!", {
        description: `Welcome back, ${userData.name}`,
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
        <div className="w-full max-w-md space-y-6 bg-white p-6 border border-gray-200 shadow-sm rounded-md sm:p-8">
          <h1 className="text-2xl font-semibold text-center">Login</h1>

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

          <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox accent-black"
            />
            <span>Remember Me</span>
          </label>

          <Button
            className="w-full bg-black text-white hover:bg-gray-900 transition"
            onClick={login}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mx-auto" />
            ) : (
              "Login"
            )}
          </Button>
        </div>
      </main>
    </>
  );
}
