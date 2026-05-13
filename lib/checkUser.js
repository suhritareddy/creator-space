import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();
  if (!user) return null;

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) return null; 

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "User";

  try {
   
    const dbUser = await db.user.upsert({
      where: { clerkUserId: user.id },
      update: { name, imageUrl: user.imageUrl }, 
      create: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email,
      },
    });
    return dbUser;
  } catch (error) {
    console.error("checkUser error:", error);
    return null;
  }
};