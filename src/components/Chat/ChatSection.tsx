import React from "react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { Room } from "@/lib/store/roomStore";

export default async function ChatSection({
  room,
  userId,
}: {
  room: Room;
  userId: string;
}) {
  return (
    <div className="flex h-[calc(100vh-1.5rem)] w-[28rem] flex-col gap-2">
      <div className="flex rounded-lg border border-border bg-card px-3 py-2 text-xl font-medium">
        {room.name}
      </div>
      <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg border border-border bg-card">
        <div className="top-gradient absolute left-0 top-0 h-16 w-full"></div>

        <div className="flex flex-1 flex-col overflow-y-scroll px-3">
          <ChatMessages roomId={room.id} userId={userId} />
        </div>
        <ChatInput roomId={room.id} userId={userId} />
      </div>
    </div>
  );
}
