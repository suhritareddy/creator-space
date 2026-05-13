"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Edit, Copy } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteScript, duplicateScript } from "@/actions/script";


const PLATFORM_COLORS = {
  Instagram: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  YouTube: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  TikTok: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
  LinkedIn: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Twitter: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
};

const ScriptCard = ({ script, workspaceId }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm("Delete this script?")) return;
    setLoading(true);
    const result = await deleteScript(script.id);
    if (result.success) {
      toast.success("Script deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete");
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    const result = await duplicateScript(script.id);
    if (result.success) {
      toast.success("Script duplicated");
      router.refresh();
    } else {
      toast.error("Failed to duplicate");
      setLoading(false);
    }
  };

  return (
    <Card className="group relative border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 hover:border-blue-400/60 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <Badge className={`text-xs font-medium px-2 py-0.5 rounded-md ${PLATFORM_COLORS[script.platform] || "bg-slate-100 text-slate-700"}`}>
            {script.platform}
          </Badge>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleDuplicate}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 text-blue-500 transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => router.push(`/workspace/${workspaceId}/generate?edit=${script.id}`)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"
            >
              <Edit className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mt-2 line-clamp-2">
          {script.title || "Untitled Script"}
        </h3>
      </CardHeader>

      <CardContent className="pb-2">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
          {script.hook || script.script || "No preview available"}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 capitalize">{script.niche}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="text-xs text-slate-400 capitalize">{script.style}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ScriptCard;