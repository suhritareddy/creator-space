"use client";

import { useState } from "react";
import { Zap, FileText, Film, Hash, MousePointerClick, Check, Copy } from "lucide-react";
import { toast } from "sonner";

function ResultSection({ icon: Icon, label, accentColor = "text-slate-400", children }) {
  return (
    <div className="bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl sm:rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 sm:px-4 py-2.5 sm:py-3 border-b border-slate-100 dark:border-slate-700/60">
        <Icon className={`h-3.5 w-3.5 flex-shrink-0 ${accentColor}`} />
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div className="p-3.5 sm:p-4">{children}</div>
    </div>
  );
}

function CopyButton({ text, label = "Copy" }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      }}
      className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex-shrink-0 touch-manipulation p-1 -m-1"
    >
      {copied
        ? <Check className="h-3 w-3 text-green-500" />
        : <Copy className="h-3 w-3" />
      }
      <span className="hidden xs:inline">{copied ? "Copied" : label}</span>
    </button>
  );
}

export default function ScriptResult({ result }) {
  const allHashtags = result.hashtags?.join(" ") ?? "";

  return (
    <div className="space-y-2.5 sm:space-y-3">

      {/* TITLE + HOOK */}
      <ResultSection icon={Zap} label="Title & hook" accentColor="text-blue-500">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-white leading-snug">
              {result.title}
            </p>
            <CopyButton text={result.title} />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">
              Hook — first 3 seconds
            </p>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-blue-50 dark:bg-blue-950/20 border-l-2 border-blue-400 px-3 py-2.5 rounded-r-lg sm:rounded-r-xl leading-relaxed">
              {result.hook}
            </p>
          </div>
        </div>
      </ResultSection>

      {/* FULL SCRIPT */}
      <ResultSection icon={FileText} label="Full script">
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-xs text-slate-400">
            ~{result.script?.split(" ").length ?? 0} words
          </span>
          <CopyButton text={result.script} label="Copy script" />
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
          {result.script}
        </p>
      </ResultSection>

      {/* SCENES */}
      {result.scenes?.length > 0 && (
        <ResultSection icon={Film} label="Scene breakdown">
          <div className="space-y-2">
            {result.scenes.map((scene, i) => (
              <div key={i} className="flex gap-2.5 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-slate-50 dark:bg-slate-900/40">
                <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                  {scene.scene ?? i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {scene.description}
                  </p>
                  {scene.duration && (
                    <p className="text-xs text-slate-400 mt-0.5">{scene.duration}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ResultSection>
      )}

      {/* CTA */}
      {result.cta && (
        <ResultSection icon={MousePointerClick} label="Call to action">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
              {result.cta}
            </p>
            <CopyButton text={result.cta} />
          </div>
        </ResultSection>
      )}

      {/* HASHTAGS */}
      {result.hashtags?.length > 0 && (
        <ResultSection icon={Hash} label="Hashtags">
          <div className="flex items-center justify-between mb-2.5 sm:mb-3">
            <span className="text-xs text-slate-400">{result.hashtags.length} tags</span>
            <CopyButton text={allHashtags} label="Copy all" />
          </div>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {result.hashtags.map((tag, i) => (
              <button
                key={i}
                onClick={() => { navigator.clipboard.writeText(tag); toast.success(`${tag} copied`); }}
                className="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 hover:bg-blue-100 dark:hover:bg-blue-950/50 active:scale-95 transition-all touch-manipulation"
              >
                {tag}
              </button>
            ))}
          </div>
        </ResultSection>
      )}
    </div>
  );
}