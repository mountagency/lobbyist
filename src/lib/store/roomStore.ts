import { create } from "zustand";

export type Room = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  password_hash: string;
};

type RoomStore = {
  currentRoom: Room | null;
  rooms: Room[];
  setCurrentRoom: (room: Room | null) => void;
  setRooms: (rooms: Room[]) => void;
  addRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
};

export const useRoom = create<RoomStore>()((set) => ({
  currentRoom: null,
  rooms: [],
  setCurrentRoom: (room) => set({ currentRoom: room }),
  setRooms: (rooms) => set({ rooms }),
  addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
  removeRoom: (roomId) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== roomId),
    })),
}));
