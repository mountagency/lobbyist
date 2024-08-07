import React, { Suspense } from "react";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/lib/store/InitMessages";
import ChatList from "./ChatList";

export default async function ChatMessages({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) {
  const supabase = createClient();
  const { data } = await supabase
    .from("message")
    .select("*,users(*)")
    .eq("room_id", roomId);

  return (
    <Suspense fallback={"loading..."}>
      <ChatList roomId={roomId} userId={userId} />
      <InitMessages messages={data ?? []} />
    </Suspense>
  );
}
