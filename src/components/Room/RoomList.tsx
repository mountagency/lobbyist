"use client";

import { type Room, useRoom } from "@/lib/store/roomStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { buttonVariants } from "../ui/button";
import { motion } from "framer-motion";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { LogOut, Megaphone, Trash } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/userStore";
import { toast } from "sonner";
import { useRouter, usePathname } from "next/navigation";

type ClientRoomListProps = {
  initialRooms: Room[];
};

type DeleteRoomPayload = {
  room: string;
};

export default function RoomList({ initialRooms }: ClientRoomListProps) {
  const { user } = useUser();
  const { userRooms, setUserRooms, optimisticDeleteRoom } = useRoom();
  const supabase = createClient();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserRooms(initialRooms);
    setIsLoading(false);
  }, [initialRooms, setUserRooms]);

  useEffect(() => {
    const channel = supabase.channel("room_updates");

    channel
      .on(
        "broadcast",
        { event: "room_deleted" },
        ({ payload }: { payload: DeleteRoomPayload }) => {
          if (payload.room) {
            console.log("Room deleted", payload.room);
            optimisticDeleteRoom(payload.room);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [optimisticDeleteRoom, supabase]);

  if (!user) {
    return null;
  }

  // Leave room
  const handleLeaveRoom = async (roomId: string) => {
    setIsLoading(true);
    const { error } = await supabase
      .from("room_users")
      .delete()
      .eq("room_id", roomId)
      .eq("user_id", user.id);
    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }
    const newRooms = userRooms.filter((room) => room.id !== roomId);
    setUserRooms(newRooms);
    setIsLoading(false);
    toast.success(`Left lobby successfully`);
    router.push("/lobby");
  };

  const handleDeleteRoom = async (room: Room) => {
    setIsLoading(true);

    const supabase = createClient();
    const channel = supabase.channel("room_updates");

    const { error } = await supabase.rpc("delete_room_and_related_data", {
      input_room_id: room.id,
      input_user_id: user.id,
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
      return;
    }

    await channel.send({
      type: "broadcast",
      event: "room_deleted",
      payload: { room: room },
    });

    optimisticDeleteRoom(room.id);
    router.push("/lobby");
    setIsLoading(false);
  };

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
        Create or join your first lobby
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
        const isOwner = room.created_by === user.id;
        return (
          <div key={room.id} className="flex items-center gap-2">
            <ContextMenu>
              <ContextMenuTrigger className="relative flex-1">
                <Link
                  key={room.id}
                  href={`/lobby/${room.name}`}
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "relative w-full",
                  )}
                >
                  <span>{room.name}</span>
                </Link>
                {usePathname() === `/lobby/${room.name}` && (
                  <div className="absolute -left-7 top-1/2 h-6 w-5 -translate-y-1/2 rounded-lg bg-neutral-300"></div>
                )}
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
                    onClick={() => handleDeleteRoom(room)}
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
      })}
    </motion.div>
  );
}
