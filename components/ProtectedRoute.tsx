"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.replace("/login");
    } else {
      setCheckingAuth(false);
    }
  }, [user, router]);

  if (checkingAuth) {
    return <Spinner />;
  }

  return <>{children}</>;
}
