"use client";

import React, { useState } from "react";
import { Input } from "../ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import { useUser } from "@/lib/store/userStore";
import { v4 as uuidv4 } from "uuid";
import { Message, useMessage } from "@/lib/store/messageStore";

export default function ChatInput() {
  const [inputValue, setInputValue] = useState("");
  const supabase = createClient();

  const user = useUser((state) => state.user);
  const addMessage = useMessage((state) => state.addMessage);
  const setOptimisticIds = useMessage((state) => state.setOptimisticIds);

  const handleSendMessage = async (content: string) => {
    if (content.trim()) {
      const id = uuidv4();
      const newMessage = {
        id,
        content,
        user_id: user?.id,
        is_edited: false,
        created_at: new Date().toISOString(),
        users: {
          id: user?.id,
          avatar_url: user?.user_metadata.avatar_url,
          created_at: new Date().toISOString(),
          display_name: user?.user_metadata.user_name,
        },
      };
      addMessage(newMessage as Message);
      setOptimisticIds(newMessage.id);
      const { error } = await supabase.from("message").insert({ content, id });
      if (error) {
        toast.error(error.message);
      }
    } else {
      toast.error("Message can not be empty.");
    }
  };

  return (
    <div className="p-4">
      <Input
        className="rounded-xl px-4"
        placeholder="Send a message"
        value={inputValue}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(inputValue);
            setInputValue("");
          }
        }}
      />
    </div>
  );
}
