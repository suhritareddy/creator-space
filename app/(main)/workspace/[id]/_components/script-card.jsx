"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { deleteScript, duplicateScript } from "@/actions/scripts";

const PLATFORM_CONFIG = {
  Instagram: { bg: "bg-pink-50 dark:bg-pink-950/30", text: "text-pink-700 dark:text-pink-400", border: "border-pink-200/60 dark:border-pink-800/40" },
  YouTube:   { bg: "bg-red-50 dark:bg-red-950/30",   text: "text-red-700 dark:text-red-400",   border: "border-red-200/60 dark:border-red-800/40" },
  TikTok:    { bg: "bg-slate-100 dark:bg-slate-800",  text: "text-slate-700 dark:text-slate-300", border: "border-slate-200/60 dark:border-slate-700" },
  LinkedIn:  { bg: "bg-blue-50 dark:bg-blue-950/30",  text: "text-blue-700 dark:text-blue-400",  border: "border-blue-200/60 dark:border-blue-800/40" },
  Twitter:   { bg: "bg-sky-50 dark:bg-sky-950/30",    text: "text-sky-700 dark:text-sky-400",    border: "border-sky-200/60 dark:border-sky-800/40" },
};

const NICHE_COLORS = {
  Food: "text-orange-500", Tech: "text-blue-500", Travel: "text-teal-500",
  Fashion: "text-pink-500", Fitness: "text-green-500", Finance: "text-emerald-500",
  Education: "text-violet-500", Entertainment: "text-rose-500",
  Lifestyle: "text-amber-500", Business: "text-indigo-500",
};

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

export default function ScriptCard({ script, workspaceId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const platform = PLATFORM_CONFIG[script.platform] ?? PLATFORM_CONFIG.TikTok;

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this script?")) return;
    setLoading(true);
    const result = await deleteScript(script.id);
    if (result.success) { toast.success("Script deleted"); router.refresh(); }
    else { toast.error("Failed to delete"); setLoading(false); }
  };

  const handleDuplicate = async (e) => {
    e.stopPropagation();
    setLoading(true);
    const result = await duplicateScript(script.id);
    if (result.success) { toast.success("Script duplicated"); router.refresh(); }
    else { toast.error("Failed to duplicate"); setLoading(false); }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    router.push(`/workspace/${workspaceId}/generate?edit=${script.id}`);
  };

  return (
    <div
      onClick={() => router.push(`/workspace/${workspaceId}/generate?edit=${script.id}`)}
      className="group relative bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3 cursor-pointer transition-all duration-200 hover:border-blue-300/70 dark:hover:border-blue-700/60 active:scale-[0.99]"
    >
      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-2">
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md border ${platform.bg} ${platform.text} ${platform.border}`}>
          {script.platform}
        </span>

        {/* ACTION BUTTONS
            Mobile: always visible (no hover needed for touch)
            Desktop: fade in on hover via group-hover */}
        <div className="flex items-center gap-0.5 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleDuplicate}
            disabled={loading}
            aria-label="Duplicate"
            className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 active:scale-95 transition-all touch-manipulation"
          >
            <IconCopy />
          </button>
          <button
            onClick={handleEdit}
            aria-label="Edit"
            className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all touch-manipulation"
          >
            <IconEdit />
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            aria-label="Delete"
            className="p-2 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 active:scale-95 transition-all touch-manipulation"
          >
            <IconTrash />
          </button>
        </div>
      </div>

      {/* TITLE */}
      <h3 className="text-sm font-semibold text-slate-800 dark:text-white line-clamp-2 leading-snug">
        {script.title || "Untitled Script"}
      </h3>

      {/* HOOK PREVIEW */}
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed flex-1">
        {script.hook || script.script || "No preview available"}
      </p>

      {/* FOOTER */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`text-xs font-medium truncate ${NICHE_COLORS[script.niche] ?? "text-slate-500"}`}>
            {script.niche}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 flex-shrink-0" />
          <span className="text-xs text-slate-400 capitalize truncate">{script.style}</span>
        </div>
        {script.hashtags?.length > 0 && (
          <span className="text-xs text-slate-400 flex-shrink-0 ml-2">{script.hashtags.length} tags</span>
        )}
      </div>
    </div>
  );
}