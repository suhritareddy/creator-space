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
export async function generateScript(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const { GoogleGenAI } = await import("@google/genai");
    const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // CALL 1 - Title + Hook
    const prompt1 = `You are a viral ${data.platform} content creator specializing in ${data.niche} content.
Topic: ${data.topic}
Style: ${data.style}

Generate ONLY a JSON object with no extra text:
{
  "title": "catchy video title under 10 words",
  "hook": "opening 3 seconds that grabs attention immediately, 1-2 sentences"
}`;

    const res1 = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ parts: [{ text: prompt1 }] }],
    });
    const text1 = res1.text.replace(/```(?:json)?\n?/g, "").trim();
    const part1 = JSON.parse(text1);

    // CALL 2 - Script + Scenes
    const prompt2 = `You are a viral ${data.platform} content creator.
Topic: ${data.topic}
Title: ${part1.title}
Style: ${data.style}
Niche: ${data.niche}

Generate ONLY a JSON object with no extra text:
{
  "script": "complete short-form script 150-200 words, written naturally for speaking",
  "scenes": [
    { "scene": 1, "description": "what happens visually", "duration": "3s" },
    { "scene": 2, "description": "what happens visually", "duration": "5s" },
    { "scene": 3, "description": "what happens visually", "duration": "5s" },
    { "scene": 4, "description": "what happens visually", "duration": "4s" }
  ]
}`;

    const res2 = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ parts: [{ text: prompt2 }] }],
    });
    const text2 = res2.text.replace(/```(?:json)?\n?/g, "").trim();
    const part2 = JSON.parse(text2);

    // CALL 3 - CTA + Hashtags
    const prompt3 = `Platform: ${data.platform}
Niche: ${data.niche}
Topic: ${data.topic}

Generate ONLY a JSON object with no extra text:
{
  "cta": "strong call to action for ${data.platform}, 1 sentence",
  "hashtags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5", "#tag6", "#tag7", "#tag8"]
}`;

    const res3 = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ parts: [{ text: prompt3 }] }],
    });
    const text3 = res3.text.replace(/```(?:json)?\n?/g, "").trim();
    const part3 = JSON.parse(text3);

    return {
      success: true,
      data: {
        title: part1.title,
        hook: part1.hook,
        script: part2.script,
        scenes: part2.scenes,
        cta: part3.cta,
        hashtags: part3.hashtags,
      },
    };
  } catch (error) {
    console.error("generateScript error:", error);
    return { success: false, error: error.message };
  }
}

export async function saveScript(data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const script = await db.script.create({
      data: {
        topic: data.topic,
        niche: data.niche,
        platform: data.platform,
        style: data.style,
        title: data.title,
        hook: data.hook,
        script: data.script,
        scenes: data.scenes,
        cta: data.cta,
        hashtags: data.hashtags,
        workspaceId: data.workspaceId,
        userId: user.id,
      },
    });

    revalidatePath(`/workspace/${data.workspaceId}`);
    return { success: true, data: script };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getScript(scriptId) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const script = await db.script.findUnique({
      where: { id: scriptId, userId: user.id },
    });

    return script;
  } catch (error) {
    return null;
  }
}

export async function updateScript(scriptId, data) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
    if (!user) throw new Error("User not found");

    const script = await db.script.update({
      where: { id: scriptId, userId: user.id },
      data: {
        topic: data.topic,
        niche: data.niche,
        platform: data.platform,
        style: data.style,
        title: data.title,
        hook: data.hook,
        script: data.script,
        scenes: data.scenes,
        cta: data.cta,
        hashtags: data.hashtags,
        thumbnailUrl: data.thumbnailUrl || null,
      },
    });

    revalidatePath(`/workspace/${script.workspaceId}`);
    return { success: true, data: script };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function generateThumbnail(data) {
  try {
    const platformStyle = {
      Instagram: "bright colorful lifestyle, square format",
      YouTube: "dramatic lighting, bold text, high contrast, 16:9",
      TikTok: "trendy aesthetic, vibrant, vertical format",
      LinkedIn: "professional clean corporate design",
      Twitter: "minimal clean design, 16:9",
    };

    const style = platformStyle[data.platform] || "social media thumbnail";

    const prompt = `Professional ${data.platform} thumbnail for a ${data.niche} creator. 
Topic: ${data.title}.
Visual style: ${style}.
Photorealistic, cinematic composition, dramatic lighting, 
rich saturated colors, shallow depth of field, 
ultra sharp focus on main subject, 
highly detailed, 8k resolution, 
no text, no words, no letters, no watermarks,
social media ready, scroll-stopping visual`;
    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            seed: Math.floor(Math.random() * 1000000),
          },
        }),
      },
    );
    if (!response.ok)
      throw new Error(`HuggingFace error: ${response.statusText}`);

    const buffer = await response.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    return {
      success: true,
      data: `data:image/jpeg;base64,${base64}`,
    };
  } catch (error) {
    console.error("Thumbnail generation error:", error);
    return { success: false, error: error.message };
  }
}
