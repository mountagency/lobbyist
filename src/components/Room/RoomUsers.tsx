// components/Chat/ActiveUsers.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";

type RoomUser = {
  user_id: string;
  users: User;
};

export default function RoomUsers({ roomId }: { roomId: string }) {
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const { data, error } = await supabase
        .from("room_users")
        .select(
          `
          user_id,
          users:user_id (
            id,
          )
        `,
        )
        .eq("room_id", roomId)
        .eq("is_active", true);

      if (error) {
        console.error("Error fetching active users:", error);
      } else if (data) {
        const users: User[] = data
          // @ts-ignore - users is not null
          .map((item: RoomUser) => item.users)
          .filter((user): user is User => user !== null);
        setActiveUsers(users);
      }
    };

    fetchActiveUsers();

    const subscription = supabase
      .channel(`room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "room_users",
          filter: `room_id=eq.${roomId}`,
        },
        fetchActiveUsers,
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [roomId, supabase]);

  return (
    <div>
      <h3>Active Users:</h3>
      <ul>
        {activeUsers.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>
    </div>
  );
}
