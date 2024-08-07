import { create } from "zustand";

export type Room = {
  id: string;
  name: string;
  created_by: string;
  created_at: string;
  password_hash: string;
};

type RoomStore = {
  userRooms: Room[];
  setUserRooms: (rooms: Room[]) => void;
  addUserRoom: (room: Room) => void;
  removeUserRoom: (roomId: string) => void;
};

export const useRoom = create<RoomStore>()((set) => ({
  userRooms: [],
  setUserRooms: (rooms) => set({ userRooms: rooms }),
  addUserRoom: (room) =>
    set((state) => ({ userRooms: [...state.userRooms, room] })),
  removeUserRoom: (roomId) =>
    set((state) => ({
      userRooms: state.userRooms.filter((room) => room.id !== roomId),
    })),
}));
