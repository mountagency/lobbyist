// components/Chat/ActiveUsers.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type Room } from "@/lib/store/roomStore";
import { useUser } from "@/lib/store/userStore";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";

type PresenceState = {
  online_at: string;
  user_id: string;
  name: string;
  avatar_url: string;
};

export default function RoomPresence({ room }: { room: Room }) {
  const { user } = useUser();
  const supabase = createClient();
  const [activeUsers, setActiveUsers] = useState<PresenceState[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`room:${room.id}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceState>();
        const users = Object.values(state).flat();
        setActiveUsers(users);
      })
      .subscribe(async (status) => {
        if (status !== "SUBSCRIBED") {
          return;
        }
        await channel.track({
          online_at: new Date().toISOString(),
          user_id: user?.id,
          name: user?.user_metadata.full_name as string,
          avatar_url: user?.user_metadata.avatar_url as string,
        });
      });

    return () => {
      void channel.unsubscribe();
    };
  }, [user, room.id, supabase]);

  if (!user) {
    return <div className="h-3 w-1"></div>;
  }

  return (
    <AnimatePresence>
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
                  "size-6 overflow-hidden rounded-full ring-2 ring-card [&:not(:last-child)]:-mr-0.5",
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
    </AnimatePresence>
  );
}
