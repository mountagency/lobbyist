// app/room/[roomName]/page.tsx
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import RoomJoin from "@/components/Room/RoomJoin";

export default async function RoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  const supabase = createClient();

  // Check if the user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // fetch room details by room ID
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", params.roomId)
    .single();

  if (error ?? !room) {
    notFound();
  }

  if (!user) {
    // Redirect to login page if not authenticated
    redirect("/");
  }

  return (
    <>
      <div className="mt-12 flex justify-between">
        <h1 className="mb-4 text-2xl font-bold">Join {room.name}</h1>
        <RoomJoin userId={user.id} roomId={room.id} />
      </div>
    </>
  );
}
