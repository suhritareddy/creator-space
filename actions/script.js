"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteScript(scriptId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const script = await db.script.delete({
      where: { id: scriptId, userId: user.id },
    });

    revalidatePath(`/workspace/${script.workspaceId}`);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function duplicateScript(scriptId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const original = await db.script.findUnique({
      where: { id: scriptId, userId: user.id },
    });
    if (!original) throw new Error("Script not found");

    const duplicate = await db.script.create({
      data: {
        topic: original.topic,
        niche: original.niche,
        platform: original.platform,
        style: original.style,
        title: `${original.title} (Copy)`,
        hook: original.hook,
        script: original.script,
        scenes: original.scenes,
        cta: original.cta,
        hashtags: original.hashtags,
        thumbnailUrl: original.thumbnailUrl,
        workspaceId: original.workspaceId,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${original.workspaceId}`);
    return { success: true, data: duplicate };
  } catch (error) {
    return { success: false, error: error.message };
  }
}