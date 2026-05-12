import { Plus, FolderOpen } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import WorkspaceCard from "./_components/workspace-card";
import { getUserWorkspaces } from "@/actions/workspaces";

export default async function DashboardPage() {
  const workspaces = await getUserWorkspaces();

  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">

        <Link href="/workspace/new">
         <Card className="group relative overflow-hidden cursor-pointer border border-blue-200/60 dark:border-blue-800/40 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 active:scale-[0.98] rounded-2xl flex flex-col min-h-[180px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="relative flex flex-col items-center justify-center flex-1 p-6 text-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 shadow-sm">
                <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800 dark:text-white">
                  Create Workspace
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Start a new AI project workspace
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        {workspaces?.map((workspace) => (
          <WorkspaceCard key={workspace.id} workspace={workspace} />
        ))}

        {!workspaces?.length && (
          <div className="flex flex-col items-center justify-center min-h-[180px] rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
              <FolderOpen className="h-5 w-5 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No workspaces yet
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Create one to get started
            </p>
          </div>
        )}

      </div>
    </div>
  );
}