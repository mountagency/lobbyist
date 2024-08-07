"use client";

import { type Room, useRoom } from "@/lib/store/roomStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";

type ClientRoomListProps = {
  initialRooms: Room[];
};

export default function RoomList({ initialRooms }: ClientRoomListProps) {
  const { userRooms, setUserRooms } = useRoom();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserRooms(initialRooms);
    setIsLoading(false);
  }, [initialRooms, setUserRooms]);

  if (isLoading) {
    return (
      <div className="text-center text-sm text-neutral-500">
        Loading rooms...
      </div>
    );
  }

  if (userRooms.length === 0) {
    return (
      <div className="text-center text-sm text-neutral-500">
        No rooms joined yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {userRooms.map((room) => {
        return (
          <div key={room.id} className="flex items-center gap-2">
            <Link
              key={room.id}
              href={`/dashboard/lobby/${room.name}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 text-left",
              )}
            >
              {room.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
