import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Video,
  FolderOpen,
  Zap,
  Hash,
  FileText,
} from "lucide-react";

const featuresData = [
  {
    icon: <Video className="h-7 w-7 text-blue-500" />,
    title: "AI Script Generation",
    description:
      "Generate viral hooks, full scripts, and scene breakdowns in seconds using Gemini AI.",
  },
  {
    icon: <Hash className="h-7 w-7 text-blue-500" />,
    title: "Smart Hashtags",
    description:
      "Get platform-optimized hashtags tailored to your niche and content style automatically.",
  },
  {
    icon: <FolderOpen className="h-7 w-7 text-blue-500" />,
    title: "Workspace Organization",
    description:
      "Organize your scripts by project or channel. Keep everything clean and accessible.",
  },
  {
    icon: <Zap className="h-7 w-7 text-blue-500" />,
    title: "Multi-Platform Support",
    description:
      "Create content optimized for Instagram, YouTube, TikTok and more — all in one place.",
  },
  {
    icon: <FileText className="h-7 w-7 text-blue-500" />,
    title: "Save & Edit Scripts",
    description:
      "Save generated scripts, edit them anytime, duplicate your best performing formats.",
  },
  {
    icon: <Sparkles className="h-7 w-7 text-blue-500" />,
    title: "CTA Generation",
    description:
      "Never forget a call to action. AI generates the perfect CTA for every piece of content.",
  },
];

export default function Home() {
  return (
    <div className="h-screen overflow-y-scroll snap-y snap-mandatory scroll-smooth">

      {/* HERO */}
      <section className="snap-start relative min-h-screen flex items-center justify-center px-4 text-center overflow-hidden">

        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 w-[450px] h-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/20 blur-[80px]" />
        </div>

        <div className="max-w-4xl mx-auto">

          {/* BADGE */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium border border-blue-500/30 bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Powered by AI
            </span>
          </div>

          {/* HEADING */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] bg-gradient-to-b from-slate-900 via-blue-900 to-blue-700 dark:from-white dark:via-slate-200 dark:to-blue-400 bg-clip-text text-transparent mb-6">
            Create Viral Scripts
            <span className="block">in Seconds</span>
          </h1>

          {/* SUBTEXT */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-10">
            AI-powered reel script generator for content creators.
            Generate hooks, scripts, scenes and hashtags instantly.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4 flex-wrap">

            <Button
              asChild
              size="lg"
              className="px-8 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90 hover:scale-105 transition-transform transition-opacity duration-300 shadow-lg"
            >
              <Link href="/dashboard">Get Started</Link>
            </Button>

            <Button
              asChild
              size="lg"
              className="px-8 sm:px-10 h-12 rounded-xl shadow-lg 
              bg-white text-slate-900 
              hover:bg-slate-900 hover:text-white 
              dark:bg-slate-200 dark:text-slate-900 
              dark:hover:bg-white dark:hover:text-slate-900
              hover:scale-105 active:scale-95 
              hover:shadow-xl transition-transform transition-colors duration-300"
            >
              <a href="#features">See Features</a>
            </Button>

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="snap-start min-h-screen flex items-center px-4 py-10"
      >
        <div className="max-w-5xl mx-auto w-full">

          {/* HEADER */}
          <div className="text-center mb-10">

            <span className="inline-flex items-center gap-2 px-4 py-1 rounded-full text-sm font-medium border border-blue-500/30 bg-blue-50/60 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-500/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Features
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-b from-slate-900 to-slate-700 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Everything you need
              <span className="block">to create top-notch content</span>
            </h2>

            <p className="mt-4 text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-2xl mx-auto">
              Powerful AI tools built to supercharge your content creation workflow.
            </p>
          </div>

          {/* CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            {featuresData.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden border border-slate-200/70 dark:border-slate-700/50 bg-white dark:bg-slate-800 hover:border-blue-400/50 dark:hover:border-blue-700/40 hover:shadow-lg hover:shadow-blue-500/10 transition-transform transition-shadow transition-colors duration-300 hover:-translate-y-1"
              >

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30 pointer-events-none" />

                <CardContent className="p-5 flex flex-col gap-3 relative">

                  <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/40 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-1">
                      {feature.title}
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                </CardContent>
              </Card>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}