import { Room } from "@/types/room-types";
import { create } from "zustand";

interface IRoomModel {
  rooms: Room[] | undefined;
  currentRoom: Room | undefined;
  add: (room: Room) => void;
  setRooms: (rooms: Room[]) => void;
  setCurrentRoom: (id: string) => void;
  delete: (id: string) => void;
  update: (id: string, room: any) => void;
}

export const useRooms = create<IRoomModel>((set) => ({
  rooms: undefined,
  currentRoom: undefined,
  add: (room: Room) => {
    set((state) => {
      return {
        rooms: state.rooms ? [...state.rooms, room] : [room],
      };
    });
  },
  setRooms: (rooms: Room[]) => {
    set({ rooms });
  },
  delete: (id: string) => {
    set((state) => {
      return { rooms: state?.rooms?.filter((room) => room.id !== id) ?? [] };
    });
  },
  update: (id: string, updatedRoom: any) => {
    set((state) => {
      return {
        rooms:
          state?.rooms?.map((room) => {
            if (room.id === id) {
              return { ...room, ...updatedRoom };
            }
            return room;
          }) ?? [],
      };
    });
  },
  setCurrentRoom: (id: string) => {
    set((state) => {
      return { currentRoom: state.rooms?.find((room) => room.id === id) };
    });
  },
}));
