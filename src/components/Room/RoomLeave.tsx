// components/Chat/LeaveRoomButton.tsx
"use client";

import { Button } from "../ui/button";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RoomLeave({ roomId }: { roomId: string }) {
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleLeaveRoom = async () => {
    if (!user) return;

    const { error } = await supabase
      .from("room_users")
      .update({ is_active: false })
      .eq("room_id", roomId)
      .eq("user_id", user.id);

    if (error) {
      toast.error("Failed to leave the room");
    } else {
      toast.success("Successfully left the room");
      router.push("/"); // Redirect to home page
    }
  };

  return (
    <Button onClick={handleLeaveRoom} variant="destructive">
      Leave Room
    </Button>
  );
}
