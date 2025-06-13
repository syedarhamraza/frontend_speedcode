"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Loader2 } from "lucide-react";

// Zod schema for profile validation
const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://backend-five-pied-88.vercel.app/api/profile", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
      });
  }, []);

  const updateProfile = async () => {
    const result = profileSchema.safeParse({ name, email });

    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        "https://backend-five-pied-88.vercel.app/api/profile",
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email }),
        }
      );

      if (res.ok) {
        toast.success("Your profile has been updated!");
      } else {
        toast.error("Failed to update profile.");
      }
    } catch {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-white text-black px-4 py-12">
        <div className="w-full max-w-md bg-white border border-gray-200 shadow-md rounded-lg p-6 sm:p-8 space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Your Profile</h1>
            <p className="text-gray-600 text-sm">
              Feel free to update your information anytime.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              required
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              type="email"
              required
            />
          </div>

          <div className="pt-2">
            <Button
              onClick={updateProfile}
              disabled={loading}
              className="w-full bg-black text-white hover:bg-gray-900 transition"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-gray-500">
            Keep your profile up to date for a better experience
          </p>
        </div>
      </main>
    </ProtectedRoute>
  );
}
