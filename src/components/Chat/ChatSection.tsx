import React from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import { User } from "@supabase/supabase-js";
import ListMessages from "./ListMessages";
import ChatMessages from "./ChatMessages";

export default async function ChatSection() {
  return (
    <div className="flex h-[calc(100vh-9rem)] flex-1 flex-col overflow-hidden rounded-3xl border border-neutral-700 bg-neutral-900 md:w-[500px]">
      <div className="relative flex h-full flex-col overflow-y-scroll px-4">
        <ChatHeader />
        <ChatMessages />
      </div>
      <ChatInput />
    </div>
  );
}
