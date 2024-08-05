import { create } from "zustand";

export type Message = {
  content: string;
  created_at: string;
  id: string;
  is_edited: boolean;
  user_id: string;
  users: {
    avatar_url: string;
    created_at: string;
    display_name: string;
    id: string;
  } | null;
};

type Messages = {
  messages: Message[];
  optimisticIds: string[];
  addMessage: (message: Message) => void;
  setOptimisticIds: (id: string) => void;
};

export const useMessage = create<Messages>()((set) => ({
  messages: [],
  optimisticIds: [],
  addMessage: (newMessages) =>
    set((state) => ({
      messages: [...state.messages, newMessages],
    })),
  setOptimisticIds: (id: string) =>
    set((state) => ({ optimisticIds: [...state.optimisticIds, id] })),
}));
