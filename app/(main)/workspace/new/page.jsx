"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, FolderPlus, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createWorkspace } from "@/actions/workspaces";

const workspaceSchema = z.object({
  name:        z.string().min(1, "Workspace name is required").max(50, "Max 50 characters"),
  description: z.string().max(200, "Max 200 characters").optional(),
});

export default function NewWorkspacePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
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
    <div className="w-full max-w-lg mx-auto px-4 sm:px-6 pb-12">

      {/* BACK */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mt-4 sm:mt-0 mb-5 sm:mb-6 touch-manipulation"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back
      </button>

      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
          Create workspace
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
          Organize scripts by channel or project
        </p>
      </div>

      {/* FORM CARD */}
      <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 rounded-xl sm:rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700/50 px-4 sm:px-5 pt-4">
          <CardTitle className="flex items-center gap-2 text-sm font-semibold">
            <FolderPlus className="h-4 w-4 text-blue-500 flex-shrink-0" />
            Workspace details
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 sm:px-5 pt-4 pb-5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* NAME */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Workspace name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. My Cooking Channel"
                {...register("name")}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl"
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name.message}</p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Description{" "}
                <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <Input
                placeholder="e.g. Food & recipe reels for Instagram"
                {...register("description")}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl"
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* BUTTONS — stacked on mobile, side by side on sm+ */}
            <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3 pt-1">
              <Button
                type="button"
                variant="outline"
                className="h-10 sm:h-11 rounded-lg sm:rounded-xl text-sm"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="h-10 sm:h-11 rounded-lg sm:rounded-xl text-sm bg-gradient-to-r from-blue-500 to-sky-500 text-white hover:opacity-90"
              >
                {loading
                  ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating...</>
                  : "Create workspace"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}