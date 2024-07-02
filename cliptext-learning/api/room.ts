import { ROOM_ENDPOINT } from "@/config/server-config";
import { Room } from "@/types/room-types";

export async function save(room: Room) {
  const response = await fetch(`${ROOM_ENDPOINT}/`, {
    method: "POST",
    body: JSON.stringify(room),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  return response.text();
}

export async function listRoomByOwner(id: string) {
  const response = await fetch(`${ROOM_ENDPOINT}/owner/${id}`, {
    method: "GET",
  });
  return response.json();
}
