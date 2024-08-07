"use client";

import React, { useEffect } from "react";
import { Message, useMessage } from "@/lib/store/messageStore";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { ChatMessage } from "./ChatMessage";

export default function ChatList({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const supabase = createClient();
  const { messages, addMessage, optimisticIds } = useMessage((state) => state);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "message",
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          if (!optimisticIds.includes(payload.new.id)) {
            const { error, data } = await supabase
              .from("users")
              .select("*")
              .eq("id", payload.new.user_id)
              .single();
            if (error) {
              toast.error(error.message);
            } else {
              const newMessage = {
                ...payload.new,
                users: data,
              };
              addMessage(newMessage as Message);
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages, roomId]);

  return (
    <div className="no-scrollbar flex h-full flex-1 flex-col overflow-y-auto">
      <div className="flex-1"></div>
      <div className="mt-12 space-y-1">
        {messages.map((message, index) => {
          const isSameUserAsPrevious =
            index > 0 && messages[index - 1]?.user_id === message.user_id;
          const isSameUserAsNext =
            index < messages.length - 1 &&
            messages[index + 1]?.user_id === message.user_id;

          let position = "";
          if (!isSameUserAsPrevious && isSameUserAsNext) {
            position = "first";
          } else if (isSameUserAsPrevious && isSameUserAsNext) {
            position = "middle";
          } else if (isSameUserAsPrevious && !isSameUserAsNext) {
            position = "last";
          } else {
            position = "single";
          }
          return (
            <ChatMessage
              message={message}
              key={index}
              position={position}
              userId={userId}
            />
          );
        })}
      </div>
    </div>
  );
}
