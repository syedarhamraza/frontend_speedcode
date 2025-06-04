"use client";

import { useState, useEffect } from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

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
    fetch("/api/user/profile", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name);
        setEmail(data.email);
      });
  }, []);

  const updateProfile = async () => {
    // Validate with Zod
    const result = profileSchema.safeParse({ name, email });
    if (!result.success) {
      toast.error(result.error.errors[0].message, {
        className: "text-base px-6 py-4",
        duration: 5000,
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/profile", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        toast.success("Profile updated!", {
          className: "text-base px-6 py-4",
          duration: 3000,
        });
      } else {
        toast.error("Update failed", {
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
          <h1 className="text-2xl font-semibold text-center">Update Profile</h1>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
            required
          />
          <Button
            className="w-full bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition cursor-pointer"
            onClick={updateProfile}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </>
  );
}
