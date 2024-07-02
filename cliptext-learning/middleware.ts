"use client";

import { clerkMiddleware } from "@clerk/nextjs/server";
import { listRoomByOwner, save } from "./api/room";
import { Room } from "./types/room-types";
import { v4 as uuid } from "uuid";

export default clerkMiddleware(async (auth, req) => {
  auth().protect();

  const userId = auth().userId;

  try {
    const rooms = await listRoomByOwner(userId!);
    if (!rooms?.length) {
      const room: Room = {
        id: uuid(),
        name: "Default",
        createdAt: Date.now(),
        owner: userId!,
        isDefault: true,
      };

      await save(room);
    }
  } catch (e) {
    console.log(e);
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
