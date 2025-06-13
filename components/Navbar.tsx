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
        variant="ghost"
        className={`w-full justify-start text-sm font-medium ${
          pathname === href
            ? "bg-black text-white"
            : "text-gray-800 hover:text-black"
        }`}
      >
        {label}
      </Button>
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-xl font-bold text-black">QuizSprint</h1>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4">
          {links.map((link, index) => (
            <div key={link.href} className="flex items-center">
              <Button
                asChild
                variant="ghost"
                className={`text-sm font-medium ${
                  pathname === link.href
                    ? "bg-black text-white"
                    : "text-gray-800 hover:text-black"
                }`}
              >
                <Link href={link.href}>{link.label}</Link>
              </Button>

              {index === links.length - 1 && (
                <div className="h-6 w-px bg-gray-300 mx-2" />
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
                  <span className="font-medium text-sm text-gray-900">
                    {user.name}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-black">
                  Account
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
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
                  variant="ghost"
                  className={`text-sm font-medium ${
                    pathname === "/login"
                      ? "bg-black text-white"
                      : "text-gray-800 hover:text-black"
                  }`}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  className={`text-sm font-medium ${
                    pathname === "/register"
                      ? "bg-black text-white"
                      : "text-gray-800 hover:text-black"
                  }`}
                >
                  <Link href="/register">Register</Link>
                </Button>
              </>
            )
          )}
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6 text-black" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 space-y-4">
              <SheetHeader>
                <SheetTitle className="text-lg font-bold text-black">
                  🎯 QuizSprint
                </SheetTitle>
              </SheetHeader>

              {links.map((link) => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}

              {!loading && user ? (
                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-800 mb-2">
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
