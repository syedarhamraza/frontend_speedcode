"use client";

import { useState } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext"; // ✅ import user context
import { toast } from "sonner";

// Zod schema for registration form
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser } = useUser(); // ✅ get setUser from context

  const register = async () => {
    setError(null);

    const result = registerSchema.safeParse({ name, email, password });
    if (!result.success) {
      const msg = result.error.errors[0].message;
      toast.error(msg);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        toast.error("Registration failed");
        return;
      }

      // ✅ Fetch the user info and update context
      const meRes = await fetch("http://localhost:4000/api/me", {
        credentials: "include",
      });

      if (!meRes.ok) throw new Error("Failed to fetch user");

      const userData = await meRes.json();
      setUser(userData);
      toast.success("Registration successful!");
      router.push("/");
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-md space-y-6 bg-white p-6 shadow-md rounded">
          <h1 className="text-2xl font-semibold text-center">Register</h1>
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button
            className="w-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer"
            onClick={register}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </div>
      </div>
    </>
  );
}
