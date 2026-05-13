"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  PenBox,
  Sun,
  Moon,
  BotMessageSquare,
} from "lucide-react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const { isSignedIn, isLoaded } = useUser();

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  // Load theme
  useEffect(() => {
    const stored = localStorage.getItem("theme");

    if (stored === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  if (!isLoaded) return null;

  return (
    <header
      className="
        fixed top-0 w-full z-50 border-b
        bg-white/60 dark:bg-slate-900/95
        backdrop-blur-md
        border-blue-200/50 dark:border-slate-700/50
      "
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link
          href="/"
          className="flex items-center gap-3"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div className="flex items-center gap-3">

            {/* ICON */}
            <div
              className="
                w-10 h-10 rounded-2xl
                flex items-center justify-center
                bg-gradient-to-br
                from-sky-400 via-blue-500 to-blue-600
              "
            >
              <BotMessageSquare className="w-5 h-5 text-white" />
            </div>

            {/* BRAND */}
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">
                Zebvo.AI
              </h1>

              <p className="text-xs text-slate-600 dark:text-slate-300">
                Creator Space
              </p>
            </div>
          </div>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {isSignedIn ? (
            <>
              {/* DASHBOARD */}
              <Link
                href="/dashboard"
                className="
                  group flex items-center gap-1
                  px-3 h-10 rounded-xl
                  bg-white/40 dark:bg-slate-800
                  border border-blue-200/40 dark:border-slate-700/50
                  text-slate-700 dark:text-white
                  hover:bg-blue-100/50 dark:hover:bg-slate-700
                  transition-all duration-300
                "
              >
                <LayoutDashboard className="w-5 h-5" />

                <span
                  className="
                    text-sm max-w-0 opacity-0 overflow-hidden
                    group-hover:max-w-24 group-hover:opacity-100
                    transition-all duration-300
                  "
                >
                  Dashboard
                </span>
              </Link>

              {/* ADD WORKSPACE */}
              <Link
                href="/workspace/new"
                className="
                  group flex items-center gap-1
                  px-3 h-10 rounded-xl
                  bg-gradient-to-r
                  from-blue-500 to-sky-500
                  text-white
                  hover:opacity-90
                  transition-all duration-300
                "
              >
                <PenBox className="w-5 h-5 group-hover:rotate-12 transition" />

                <span
                  className="
                    text-sm max-w-0 opacity-0 overflow-hidden
                    group-hover:max-w-32 group-hover:opacity-100
                    transition-all duration-300
                  "
                >
                  Add Workspace
                </span>
              </Link>

              {/* THEME TOGGLE */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="p-2.5 rounded-xl
                  text-slate-600 dark:text-slate-300
                  hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-blue-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-700" />
                )}
              </button>

              {/* USER */}
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </>
          ) : (
            <>
              {/* THEME */}
              <button
                onClick={() => setDarkMode((prev) => !prev)}
                className="
                  p-2.5 rounded-xl
                  bg-white/40 dark:bg-slate-800
                  border border-blue-200/40 dark:border-slate-700/50
                  text-slate-700 dark:text-slate-200
                  hover:bg-blue-100/50 dark:hover:bg-slate-700
                  transition-all duration-300
                "
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-blue-700" />
                )}
              </button>

              {/* LOGIN */}
              <SignInButton>
                <button
                  className="
                    px-5 h-10 rounded-xl
                    bg-gradient-to-r
                    from-blue-500 to-sky-500
                    text-white font-medium
                    hover:opacity-90
                    transition-all duration-300
                  "
                >
                  Login
                </button>
              </SignInButton>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;