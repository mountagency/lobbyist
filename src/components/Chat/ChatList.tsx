"use client";

import React, { useEffect, useRef, useState } from "react";
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

  const scrollRef = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [userScrolled, setUserScrolled] = useState(false);
  const [notification, setNotification] = useState(2);

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
          if (!optimisticIds.includes(payload.new.id as string)) {
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

          const scrollContainer = scrollRef.current;
          if (
            scrollContainer.scrollTop <
            scrollContainer.scrollHeight - scrollContainer.clientHeight - 10
          ) {
            setNotification((current) => current + 1);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [messages, roomId]);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer && !userScrolled) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const handleOnScroll = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      const isScroll =
        scrollContainer.scrollTop <
        scrollContainer.scrollHeight - scrollContainer.clientHeight - 100;
      setUserScrolled(isScroll);
      if (
        scrollContainer.scrollTop ===
        scrollContainer.scrollHeight - scrollContainer.clientHeight
      ) {
        setNotification(0);
      }
    }
  };

  const scrollDown = () => {
    setNotification(0);
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  };

  return (
    <>
      {messages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={scrollRef}
          onScroll={handleOnScroll}
          className="no-scrollbar mb-10 flex h-full flex-1 flex-col overflow-y-auto pb-8"
        >
          <div className="flex-1"></div>
          <div className="space-y-1">
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
                  key={message.id + index}
                  position={position}
                  userId={userId}
                />
              );
            })}
          </div>
        </motion.div>
      )}

      {userScrolled && notification > 0 && (
        <div className="absolute bottom-16 left-1/2">
          <div
            className="mx-auto flex -translate-x-1/2 cursor-pointer items-center gap-2 rounded-md border bg-background px-3 py-2 text-center text-sm shadow-xl shadow-background/40"
            onClick={scrollDown}
          >
            <div className="size-2 animate-pulse rounded-full bg-red-500"></div>
            <p>{`${notification} new message${notification > 1 ? "s" : ""}`}</p>
          </div>
        </div>
      )}
    </>
  );
}
