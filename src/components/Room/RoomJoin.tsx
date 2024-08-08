"use client";

import { useState } from "react";
import { Input } from "../ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { redirect, useRouter } from "next/navigation";

export default function RoomForm({
  userId,
  roomId,
}: {
  userId: string;
  roomId: string;
}) {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const supabase = createClient();
  const user = supabase.auth.getUser();

  if (!user) {
    return redirect("/");
  }

  const handleCancel = () => {
    return redirect("/");
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("You must be logged in to join a room");
      return;
    }

    // Check if the room exists
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (roomError ?? !room) {
      toast.error("Room not found");
      return;
    }

    // Verify the password
    const passwordMatch = await bcrypt.compare(password, room.password_hash);
    if (!passwordMatch) {
      toast.error("Incorrect password");
      return;
    }

    // Check if the user is already in the room
    const { data: existingMembership, error: membershipError } = await supabase
      .from("room_users")
      .select("*")
      .eq("room_id", roomId)
      .eq("user_id", userId)
      .single();

    if (membershipError && membershipError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is expected if the user is not in the room
      toast.error("Error checking room membership");
      return;
    }

    if (existingMembership) {
      // User is already in the room, just redirect
      toast.error("Already in the room");
      setPassword("");
      router.push(`/lobby/${room.name}`);
      return;
    }

    // Add user to room_users table
    const { error: joinError } = await supabase.from("room_users").insert({
      room_id: roomId,
      user_id: userId,
    });

    if (joinError) {
      toast.error("Failed to join the room");
      return;
    }

    // Successfully joined the room
    toast.success("Successfully joined the room");
    setPassword("");
    router.push(`/lobby/${room.name}`);
  };

  return (
    <form className="space-y-2" autoComplete="off">
      <Input
        className="rounded-xl"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Lobby Password"
        required
      />
      <div className="grid gap-2 pt-3">
        {/* <Button onClick={handleCancel} variant={"outline"}>
          Cancel
        </Button> */}
        <Button
          onClick={handleJoinRoom}
          className="justify-center rounded-xl border border-neutral-700"
        >
          Join Lobby
        </Button>
      </div>
    </form>
  );
}
