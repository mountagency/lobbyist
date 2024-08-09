import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import RoomJoin from "@/components/Room/RoomJoin";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    redirect("/lobby");
  }

  return (
    <div className="flex h-[100dvh] items-center justify-center">
      <Card className="w-[24rem]">
        <CardHeader className="text-center">
          <CardTitle>
            Join lobby <span className="text-neutral-400">{room.name}</span>
          </CardTitle>
          <CardDescription className="pt-3">
            Enter the password to join the room
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RoomJoin userId={user.id} roomId={room.id} />
        </CardContent>
      </Card>
    </div>
  );
}
