"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";

// Type for the user object (customize as needed)
type User = {
  id: number;
  name: string;
  email: string;
  score: number | null;
};

// Context value type
type UserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  logout: () => Promise<void>;
};

// Create context with default value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props type
type Props = {
  children: ReactNode;
};

export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not logged in");
        return res.json();
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  // Logout function
  const logout = async () => {
    try {
      const res = await fetch("api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        setUser(null);
      } else {
        console.error("Logout failed");
      }
    } catch (err) {
      console.error("Network error during logout", err);
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to safely use the context
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
