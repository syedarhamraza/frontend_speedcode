"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useUser();
  const [sheetOpen, setSheetOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/leaderboard", label: "Leaderboard" },
    { href: "/quiz", label: "Take Quiz" },
    { href: "/profile", label: "Profile" },
  ];

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const NavLink = ({ href, label }: { href: string; label: string }) => (
    <Link href={href} onClick={() => setSheetOpen(false)}>
      <Button
        variant={pathname === href ? "default" : "ghost"}
        className={`w-full justify-start text-sm font-medium ${
          pathname === href
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        }`}
      >
        {label}
      </Button>
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          🎯 QuizSprint
        </h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link, index) => (
            <div key={link.href} className="flex items-center">
              <Button
                asChild
                variant={pathname === link.href ? "default" : "ghost"}
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>

              {/* Add separator after Profile (last link) */}
              {index === links.length - 1 && (
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
              )}
            </div>
          ))}

          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center space-x-2 cursor-pointer">
                  <Avatar>
                    <AvatarFallback>
                      {user.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
                    {user.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 focus:text-red-600"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !loading && (
              <>
                <Button
                  asChild
                  variant={pathname === "/login" ? "default" : "ghost"}
                  className={`text-sm font-medium ${
                    pathname === "/login"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant={pathname === "/register" ? "default" : "ghost"}
                  className={`text-sm font-medium ${
                    pathname === "/register"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                  }`}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )
          )}
        </div>

        {/* Mobile Nav - Hamburger */}
        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 space-y-4">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  🏆 Student Leaderboard
                </SheetTitle>
              </SheetHeader>

              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}

              {!loading && user ? (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-700 dark:text-gray-200 mb-2">
                    Logged in as:{" "}
                    <span className="font-medium">{user.name}</span>
                  </p>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                !loading && (
                  <>
                    <NavLink href="/login" label="Login" />
                    <NavLink href="/register" label="Register" />
                  </>
                )
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
