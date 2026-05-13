"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserWorkspaces() {
  try {
    const { userId } = await auth();
    if (!userId) return []; 

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) return [];

    return await db.workspace.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { scripts: true } } },
    });
  } catch (error) {
    console.error("getUserWorkspaces error:", error);
    return []; 
  }
}

export async function createWorkspace(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const workspace = await db.workspace.create({
      data: {
        name: data.name,
        description: data.description || null,
        userId: user.id,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, data: workspace };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteWorkspace(workspaceId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    await db.workspace.delete({
      where: { id: workspaceId, userId: user.id },
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function getWorkspaceWithScripts(workspaceId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const workspace = await db.workspace.findUnique({
      where: { id: workspaceId, userId: user.id },
      include: {
        scripts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return workspace;
  } catch (error) {
    console.error(error);
    return null;
  }
}