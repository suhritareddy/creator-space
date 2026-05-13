"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, FolderPlus } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createWorkspace } from "@/actions/workspaces";

const workspaceSchema = z.object({
  name: z.string().min(1, "Workspace name is required").max(50, "Max 50 characters"),
  description: z.string().max(200, "Max 200 characters").optional(),
});

export default function NewWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workspaceSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    const result = await createWorkspace(data);
    if (result.success) {
      toast.success("Workspace created!");
      router.push(`/workspace/${result.data.id}`);
    } else {
      toast.error(result.error || "Failed to create workspace");
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
          Create Workspace
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
          A workspace helps you organize scripts by channel or project
        </p>
      </div>

      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <CardTitle className="flex items-center gap-2 text-base">
            <FolderPlus className="h-5 w-5 text-blue-500" />
            Workspace Details
          </CardTitle>
        </CardHeader>

        <CardContent className="pt-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Workspace Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. My Cooking Channel"
                {...register("name")}
                className="h-11 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Description <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <Input
                placeholder="e.g. Food & recipe reels for Instagram"
                {...register("description")}
                className="h-11 bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700"
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 h-11 bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Workspace"
                )}
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}