"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

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
      const msg = result.error.errors[0].message;
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-five-pied-88.vercel.app//api/login",
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
        "https://backend-five-pied-88.vercel.app//api/me",
        {
          credentials: "include",
        }
      );

      if (!meRes.ok) {
        throw new Error("Failed to fetch user");
      }

      const userData = await meRes.json();
      setUser(userData);

      toast.success("Login successful!", {
        description: `Welcome back, ${userData.name}`,
      });

      router.push("/submit");
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 bg-white p-6 shadow-md rounded">
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
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox"
            />
            <span>Remember Me</span>
          </label>

          <Button
            className="w-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </div>
    </>
  );
}
