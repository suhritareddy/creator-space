
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import ScriptCard from "./_components/script-card";
import { getWorkspaceWithScripts } from "@/actions/workspaces";

export default async function WorkspacePage({ params }) {
  const { id } = await params;
  const workspace = await getWorkspaceWithScripts(id);

  if (!workspace) notFound();

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
            Workspace
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
            {workspace.name}
          </h1>
          {workspace.description && (
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
              {workspace.description}
            </p>
          )}
        </div>

        <Link href={`/workspace/${id}/generate`}>
          <Button className="h-11 px-5 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90 rounded-xl flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Generate Script
          </Button>
        </Link>
      </div>

      {/* SCRIPTS */}
      {workspace.scripts.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 flex items-center justify-center mb-4">
            <Sparkles className="h-6 w-6 text-blue-500" />
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
            No scripts yet
          </p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1 mb-5">
            Generate your first AI script for this workspace
          </p>
          <Link href={`/workspace/${id}/generate`}>
            <Button className="bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Generate Script
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {workspace.scripts.map((script) => (
            <ScriptCard key={script.id} script={script} workspaceId={id} />
          ))}
        </div>
      )}
    </div>
  );
}