// components/Chat/ActiveUsers.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRoom, type Room } from "@/lib/store/roomStore";
import { useUser } from "@/lib/store/userStore";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type PresenceState = {
  online_at: string;
  user_id: string;
  name: string;
  avatar_url: string;
};

type UserMetaData = {
  custom_claims: {
    global_name: string;
  };
  avatar_url: string;
};

export default function RoomPresence({ room }: { room: Room }) {
  const { user } = useUser();
  const { optimisticDeleteRoom } = useRoom();
  const supabase = createClient();
  const [activeUsers, setActiveUsers] = useState<PresenceState[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`room_updates`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceState>();
        const users = Object.values(state).flat();

        // Create a Map to store unique users by their user_id
        const uniqueUsersMap = new Map<string, PresenceState>();
        users.forEach((user) => {
          if (
            !uniqueUsersMap.has(user.user_id) ||
            new Date(user.online_at) >
              new Date(uniqueUsersMap.get(user.user_id)!.online_at)
          ) {
            uniqueUsersMap.set(user.user_id, user);
          }
        });

        // Convert the Map back to an array
        const uniqueUsers = Array.from(uniqueUsersMap.values());
        setActiveUsers(uniqueUsers);
      })
      .on("broadcast", { event: "room_deleted" }, () => {
        toast.info(`${room.name} has been deleted by the host`);
        optimisticDeleteRoom(room.id);
        router.push("/lobby");
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        await channel.track({
          online_at: new Date().toISOString(),
          user_id: user?.id,
          name: (user?.user_metadata as UserMetaData).custom_claims.global_name,
          avatar_url: (user?.user_metadata as UserMetaData).avatar_url,
        });
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, room.id, supabase, router]);

  if (!user) {
    return <div className="h-3 w-1"></div>;
  }

  return (
    <>
      {activeUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center gap-3"
        >
          <div className="size-2 animate-pulse rounded-full bg-green-400"></div>
          <div className="flex items-center text-xs font-semibold">
            {activeUsers?.map((user, index) => (
              <div
                key={user.user_id + index}
                className={cn(
                  "size-6 overflow-hidden rounded-full bg-card ring-2 ring-card [&:not(:last-child)]:-mr-0.5",
                )}
              >
                <Image
                  src={user.avatar_url}
                  alt={`Message by user ${user.name}`}
                  width={128}
                  height={128}
                />
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
