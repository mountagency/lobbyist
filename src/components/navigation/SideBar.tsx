import Link from "next/link";
import React from "react";
import AuthButton from "../AuthButton";
import RoomList from "../Room/RoomList";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Room } from "@/lib/store/roomStore";

export default async function SideBar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRooms: Room[] = [];
  if (user) {
    const { data, error } = await supabase
      .from("room_users")
      .select("rooms(*)")
      .eq("user_id", user.id);

    if (!error && data) {
      userRooms = data
        .map((item) => item.rooms)
        .filter((room): room is Room => room !== null);
    }
  }

  return (
    <div className="h-[100dvh] w-[18rem] p-3">
      <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-card">
        <div className="space-y-4 p-3">
          <div className="flex items-center justify-center px-2 py-12">
            <Link href="/" className={cn("text-2xl font-medium")}>
              Lobbyist<span className="text-neutral-400">™</span>
            </Link>
          </div>
          <RoomList initialRooms={userRooms} />
        </div>
        <div className="p-3">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
