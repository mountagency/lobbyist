"use client";

import { type Room, useRoom } from "@/lib/store/roomStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { motion } from "framer-motion";

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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex flex-col gap-2"
      >
        <div
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full animate-pulse opacity-50",
          )}
        ></div>
        <div
          className={cn(
            buttonVariants({ variant: "outline" }),
            "w-full animate-pulse opacity-50",
          )}
        ></div>
      </motion.div>
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-2"
    >
      {userRooms.map((room) => {
        return (
          <div key={room.id} className="flex items-center gap-2">
            <Link
              key={room.id}
              href={`/lobby/${room.name}`}
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
    </motion.div>
  );
}
