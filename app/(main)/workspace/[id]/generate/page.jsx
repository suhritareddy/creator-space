"use client";

import { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Sparkles, Wand2, ArrowLeft, Save, Image } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { generateScript, saveScript, getScript, updateScript, generateThumbnail } from "@/actions/scripts";
import ScriptResult from "./_components/script-result";

const scriptSchema = z.object({
  topic:    z.string().min(1, "Topic is required"),
  niche:    z.string().min(1, "Niche is required"),
  platform: z.string().min(1, "Platform is required"),
  style:    z.string().min(1, "Style is required"),
});

const PLATFORMS = ["Instagram", "YouTube", "TikTok", "LinkedIn", "Twitter"];
const NICHES    = ["Food","Travel","Tech","Fashion","Fitness","Finance","Education","Entertainment","Lifestyle","Business"];
const STYLES    = ["Funny","Serious","Educational","Inspirational","Conversational","Storytelling"];

export default function GeneratePage({ params }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const { id: workspaceId } = use(params);

  const [generating, setGenerating]           = useState(false);
  const [saving, setSaving]                   = useState(false);
  const [result, setResult]                   = useState(null);
  const [thumbnail, setThumbnail]             = useState(null);
  const [generatingThumb, setGeneratingThumb] = useState(false);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(scriptSchema),
    defaultValues: { topic: "", niche: "", platform: "", style: "" },
  });

  useEffect(() => {
    if (!editId) return;
    getScript(editId).then((script) => {
      if (!script) return;
      setValue("topic", script.topic);
      setValue("niche", script.niche);
      setValue("platform", script.platform);
      setValue("style", script.style);
      setResult({
        title: script.title, hook: script.hook, script: script.script,
        scenes: script.scenes, cta: script.cta, hashtags: script.hashtags,
      });
      if (script.thumbnailUrl) setThumbnail(script.thumbnailUrl);
    });
  }, [editId]);

  const onSubmit = async (data) => {
    setGenerating(true);
    setResult(null);
    setThumbnail(null);
    try {
      const generated = await generateScript(data);
      if (generated.success) {
        setResult(generated.data);
        toast.success("Script generated!");
        setTimeout(() => {
          document.getElementById("result-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      } else {
        toast.error(generated.error || "Failed to generate script");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerateThumbnail = async () => {
    setGeneratingThumb(true);
    try {
      const res = await generateThumbnail({
        title: result.title,
        platform: watch("platform"),
        niche: watch("niche"),
      });
      if (res.success) {
        setThumbnail(res.data);
        toast.success("Thumbnail generated!");
      } else {
        toast.error("Failed to generate thumbnail");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setGeneratingThumb(false);
    }
  };

  const handleSave = async () => {
    if (!result) return;
    setSaving(true);
    try {
      const formData = {
        topic: watch("topic"), niche: watch("niche"),
        platform: watch("platform"), style: watch("style"),
        ...result,
        thumbnailUrl: thumbnail || null,
        workspaceId,
      };
      const res = editId ? await updateScript(editId, formData) : await saveScript(formData);
      if (res.success) {
        toast.success(editId ? "Script updated!" : "Script saved!");
        router.push(`/workspace/${workspaceId}`);
      } else {
        toast.error(res.error || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 pb-12">

      {/* BACK LINK */}
      <button
        onClick={() => router.push(`/workspace/${workspaceId}`)}
        className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors mt-4 sm:mt-0 mb-5 sm:mb-6 touch-manipulation"
      >
        <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        Back to workspace
      </button>

      {/* PAGE HEADER */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-white">
          {editId ? "Edit script" : "Generate script"}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 text-xs sm:text-sm">
          Fill in the details and let AI craft your viral script
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-700/50 px-4 sm:px-5 pt-4">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold">
              <Wand2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
              Script details
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 sm:px-5 pt-4 pb-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Topic <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. 5 easy pasta recipes under 10 minutes"
                {...register("topic")}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl"
              />
              {errors.topic && <p className="text-xs text-red-500">{errors.topic.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Niche <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(v) => setValue("niche", v)} defaultValue={watch("niche")}>
                  <SelectTrigger className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl">
                    <SelectValue placeholder="Select niche" />
                  </SelectTrigger>
                  <SelectContent>
                    {NICHES.map((n) => <SelectItem key={n} value={n}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.niche && <p className="text-xs text-red-500">{errors.niche.message}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                  Platform <span className="text-red-500">*</span>
                </label>
                <Select onValueChange={(v) => setValue("platform", v)} defaultValue={watch("platform")}>
                  <SelectTrigger className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl">
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.platform && <p className="text-xs text-red-500">{errors.platform.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300">
                Content style <span className="text-red-500">*</span>
              </label>
              <Select onValueChange={(v) => setValue("style", v)} defaultValue={watch("style")}>
                <SelectTrigger className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700 rounded-lg sm:rounded-xl">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {STYLES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.style && <p className="text-xs text-red-500">{errors.style.message}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col-reverse sm:grid sm:grid-cols-2 gap-2.5 sm:gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-10 sm:h-11 rounded-lg sm:rounded-xl text-sm"
            onClick={() => router.push(`/workspace/${workspaceId}`)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={generating}
            className="h-10 sm:h-11 rounded-lg sm:rounded-xl text-sm bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:opacity-90"
          >
            {generating
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating...</>
              : <><Sparkles className="mr-2 h-4 w-4" />{editId ? "Regenerate" : "Generate script"}</>
            }
          </Button>
        </div>
      </form>

      {/* RESULT */}
      {result && (
        <div id="result-anchor" className="mt-8 sm:mt-10">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
            <span className="text-xs font-medium text-slate-400 uppercase tracking-widest whitespace-nowrap">
              Generated result
            </span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          </div>

          <ScriptResult result={result} />

          {/* THUMBNAIL */}
          <div className="mt-4">
            <Button
              type="button"
              onClick={handleGenerateThumbnail}
              disabled={generatingThumb}
              variant="outline"
              className="w-full h-11 rounded-xl border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30"
            >
              {generatingThumb
                ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating thumbnail...</>
                : <><Image className="mr-2 h-4 w-4" />{thumbnail ? "Regenerate thumbnail" : "Generate thumbnail"}</>
              }
            </Button>

           {thumbnail && (
  <div className="mt-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 min-h-[200px] flex items-center justify-center">
    <img
      src={thumbnail}
      alt="Generated thumbnail"
      className="w-full object-cover opacity-0 transition-opacity duration-300"
      onLoad={(e) => e.target.style.opacity = "1"}
      onError={(e) => {
        e.target.style.display = "none";
        e.target.parentElement.innerHTML = '<p class="text-sm text-slate-400 p-4 text-center">Thumbnail failed to load — try regenerating</p>';
      }}
    />
  </div>
)}
          </div>

          {/* SAVE */}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full h-11 sm:h-12 mt-4 sm:mt-5 rounded-lg sm:rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:opacity-90"
          >
            {saving
              ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
              : <><Save className="mr-2 h-4 w-4" />{editId ? "Update script" : "Save script"}</>
            }
          </Button>
        </div>
      )}
    </div>
  );
}