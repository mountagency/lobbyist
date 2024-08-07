import Link from "next/link";
import React from "react";
import AuthButton from "../AuthButton";
import RoomList from "../Room/RoomList";
import { cn } from "@/lib/utils";

export default function SideBar() {
  return (
    <div className="h-[100dvh] w-[18rem] p-3">
      <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-card">
        <div className="space-y-4 p-3">
          <div className="flex items-center justify-center px-2 py-12">
            <Link href="/" className={cn("text-2xl font-medium")}>
              Lobbyist<span className="text-neutral-400">™</span>
            </Link>
          </div>
          <RoomList />
        </div>
        <div className="p-3">
          <AuthButton />
        </div>
      </div>
    </div>
  );
}
