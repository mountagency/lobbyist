// app/room/[roomName]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import ChatSection from "@/components/Chat/ChatSection";

export default async function RoomPage({
  params,
}: {
  params: { roomName: string };
}) {
  const supabase = createClient();

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Redirect to login page if not authenticated
    redirect("/login");
  }

  // Fetch room details
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("name", params.roomName)
    .single();

  if (error || !room) {
    notFound();
  }

  // Check if the user has joined the room
  const { data: userRoom, error: userRoomError } = await supabase
    .from("room_users")
    .select("*")
    .eq("user_id", user.id)
    .eq("room_id", room.id)
    .single();

  if (userRoomError || !userRoom) {
    // Redirect to a page explaining they need to join the room first
    redirect(`/join-room/${room.id}`);
  }

  return (
    <div className="flex w-full justify-between">
      <ChatSection room={room} userId={user.id} />
    </div>
  );
}
