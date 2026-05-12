import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Creator Space",
  description: "Work on Finances today, for better tomorrow",
};

export default async function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        data-scroll-behavior="smooth"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body
          className="
            min-h-screen flex flex-col
            bg-gradient-to-br
            from-sky-100 via-blue-200 to-blue-300
            dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
            bg-fixed
            transition-all duration-500
          "
        >
          {/* Header */}
          <Header />

          {/* Main Content */}
          <main className="flex-1 pt-8">
            {children}
          </main>

          {/* Footer */}
          <footer
            className="
              mt-auto border-t
              bg-white/30 dark:bg-slate-900/50
              backdrop-blur-xl
              border-white/30 dark:border-slate-700/50
            "
          >
            <div className="container mx-auto px-4 py-8 text-center">
              <p className="text-slate-800 dark:text-slate-300 text-sm font-medium">
                © {new Date().getFullYear()} Creator Space • Built by Suhrita Reddy
              </p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}