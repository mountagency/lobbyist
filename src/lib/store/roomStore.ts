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
  roomDialogOpen: boolean;
  optimisticIds: string[];
  setUserRooms: (rooms: Room[]) => void;
  addUserRoom: (room: Room) => void;
  removeUserRoom: (roomId: string) => void;
  optimisticDeleteRoom: (messageId: string) => void;
  setRoomDialogOpen: (open: boolean) => void;
};

export const useRoom = create<RoomStore>()((set) => ({
  userRooms: [],
  optimisticIds: [],
  roomDialogOpen: false,
  setUserRooms: (rooms) => set({ userRooms: rooms }),
  addUserRoom: (room) =>
    set((state) => ({ userRooms: [...state.userRooms, room] })),
  removeUserRoom: (roomId) =>
    set((state) => ({
      userRooms: state.userRooms.filter((room) => room.id !== roomId),
    })),
  optimisticDeleteRoom: (roomId) =>
    set((state) => {
      return {
        userRooms: state.userRooms.filter((room) => room.id !== roomId),
      };
    }),
  setRoomDialogOpen: (open) => set({ roomDialogOpen: open }),
}));
