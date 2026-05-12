"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FolderOpen, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteWorkspace } from "@/actions/workspaces";

const WorkspaceCard = ({ workspace }) => {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);

  const handleDeleteClick = (e) => {
    e.preventDefault();
    setConfirming(true);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    const result = await deleteWorkspace(workspace.id);
    if (result.success) {
      toast.success("Workspace deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete workspace");
      setConfirming(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    setConfirming(false);
  };

  return (
    <Link href={`/workspace/${workspace.id}`}>
      <Card className="group relative cursor-pointer border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 transition-all duration-300 hover:-translate-y-1 flex flex-col min-h-[180px]">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60">
              <FolderOpen className="h-5 w-5 text-blue-500" />
            </div>
            {confirming ? (
              <div className="flex items-center gap-1">
                <button
                  onClick={handleConfirm}
                  aria-label="Confirm delete"
                  className="text-xs px-2 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 transition-colors"
                >
                  Delete
                </button>
                <button
                  onClick={handleCancel}
                  aria-label="Cancel delete"
                  className="text-xs px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={handleDeleteClick}
                aria-label={`Delete ${workspace.name}`}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <CardTitle className="text-base font-semibold text-slate-800 dark:text-white mt-2">
            {workspace.name}
          </CardTitle>
        </CardHeader>

        <CardContent className="pb-2 flex-1">
          {workspace.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
              {workspace.description}
            </p>
          )}
        </CardContent>

        <CardFooter>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
            <FileText className="h-3.5 w-3.5" />
            <span>{workspace._count.scripts} scripts</span>
          </div>
        </CardFooter>

        
      </Card>
    </Link>
  );
};

export default WorkspaceCard;