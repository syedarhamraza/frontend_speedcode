import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "../context/UserContext";
import { QuizProvider } from "../context/QuizContext"; // ✅ Import QuizProvider
import { Toaster } from "@/components/ui/sonner";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz Sprint",
  description: "A fun and engaging quiz platform to test your knowledge!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider>
          <QuizProvider>
            {" "}
            {/* ✅ Wrap children with QuizProvider */}
            {children}
          </QuizProvider>
        </UserProvider>
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            classNames: {
              toast: "text-base px-6 py-4 rounded-lg shadow-md",
            },
          }}
        />
      </body>
    </html>
  );
}
