"use client";

import { ContextMenu, ContextMenuTrigger } from "@radix-ui/react-context-menu";
import Link from "next/link";
import React, { useEffect } from "react";
import {
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
} from "../ui/context-menu";
import { LogOut, Trash } from "lucide-react";
import { Room, useRoom } from "@/lib/store/roomStore";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/client";

type Props = {
  room: Room;
  isOwner: boolean;
  handleLeaveRoom: (roomId: string) => void;
  handleDeleteRoom: (roomId: string) => void;
};

export default function RoomListItem({
  room,
  isOwner,
  handleLeaveRoom,
  handleDeleteRoom,
}: Props) {
  return (
    <div key={room.id} className="flex items-center gap-2">
      <ContextMenu>
        <ContextMenuTrigger className="flex-1">
          <Link
            key={room.id}
            href={`/lobby/${room.name}`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            {room.name}
          </Link>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => handleLeaveRoom(room.id)}>
            Leave
            <ContextMenuShortcut>
              <LogOut size={14} />
            </ContextMenuShortcut>
          </ContextMenuItem>
          {isOwner && (
            <ContextMenuItem
              onClick={() => handleDeleteRoom(room.id)}
              disabled={!isOwner}
            >
              Delete
              <ContextMenuShortcut>
                <Trash size={14} />
              </ContextMenuShortcut>
            </ContextMenuItem>
          )}
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
