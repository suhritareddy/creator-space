import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, FileText, FolderOpen } from "lucide-react";
import ScriptCard from "./_components/script-card";
import { getWorkspaceWithScripts } from "@/actions/workspaces";

export default async function WorkspacePage({ params }) {
  const { id } = await params;
  const workspace = await getWorkspaceWithScripts(id);
  if (!workspace) notFound();

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12">

      {/* HERO */}
      <div className="mb-6 sm:mb-8 lg:mb-10">

        {/* BADGE */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 mb-3 sm:mb-4">
          <FolderOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          Workspace
        </div>

        {/* HEADER ROW */}
        <div className="flex flex-col gap-4 sm:gap-5 lg:flex-row lg:items-end lg:justify-between">

          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
              {workspace.name}
            </h1>

            {workspace.description && (
              <p className="mt-2 sm:mt-3 text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-2xl line-clamp-2 sm:line-clamp-none">
                {workspace.description}
              </p>
            )}

            {/* STATS */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 mt-3 sm:mt-4">
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span>{workspace.scripts.length} scripts</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span>AI generated</span>
              </div>
            </div>
          </div>

          {/* CTA — full width on mobile, auto on md+ */}
          <Link href={`/workspace/${id}/generate`} className="w-full sm:w-auto lg:flex-shrink-0">
            <Button className="w-full sm:w-auto h-10 sm:h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm hover:opacity-90 transition-all">
              <Plus className="h-4 w-4 mr-1.5" />
              Generate Script
            </Button>
          </Link>
        </div>
      </div>

      {/* CONTENT */}
      {workspace.scripts.length === 0 ? (

        /* EMPTY STATE */
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-900/40 p-6 sm:p-10 lg:p-12 min-h-[280px] sm:min-h-[360px] flex flex-col items-center justify-center text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-2xl sm:rounded-3xl bg-blue-100 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center mb-5">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
          </div>

          <h2 className="relative text-lg sm:text-2xl font-bold text-slate-900 dark:text-white">
            No scripts yet
          </h2>
          <p className="relative mt-2 sm:mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-md leading-relaxed">
            Start creating AI-generated scripts tailored for your audience and social platforms.
          </p>

          <Link href={`/workspace/${id}/generate`} className="relative w-full sm:w-auto mt-6">
            <Button className="w-full sm:w-auto h-10 sm:h-11 px-5 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 text-white text-sm hover:opacity-90 transition-all">
              <Plus className="h-4 w-4 mr-1.5" />
              Generate Your First Script
            </Button>
          </Link>
        </div>

      ) : (
        <>
          {/* SECTION HEADER */}
          <div className="flex flex-col xs:flex-row xs:items-end xs:justify-between gap-2 mb-4 sm:mb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                Generated Scripts
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                Browse and manage your AI generated content
              </p>
            </div>
          </div>

          {/* GRID — 1 col mobile, 2 col sm, 3 col xl */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
            {workspace.scripts.map((script) => (
              <ScriptCard key={script.id} script={script} workspaceId={id} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}