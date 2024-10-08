"use client";

import { useState } from "react";
import { useUser } from "@/lib/store/userStore";
import { type Room, useRoom } from "@/lib/store/roomStore";
import { Input } from "../ui/input";
import { createClient } from "@/utils/supabase/client";
import { Button } from "../ui/button";
import { toast } from "sonner";
import bcrypt from "bcryptjs";
import { useRouter } from "next/navigation";
import { type PostgrestError } from "@supabase/supabase-js";

type CreateRoomResult = {
  room: Room | null;
  error: string | null;
};

export default function RoomForm() {
  const [roomName, setRoomName] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useUser();
  const { addUserRoom, setRoomDialogOpen } = useRoom();
  const router = useRouter();

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to join a lobby");
      return;
    }

    const supabase = createClient();

    // Check if the room exists
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("*")
      .eq("name", roomName)
      .single();

    if (roomError ?? !room) {
      toast.error("Lobby not found");
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
      .eq("room_id", room.id)
      .eq("user_id", user.id)
      .single();

    if (membershipError && membershipError.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is expected if the user is not in the room
      toast.error("Error checking room membership");
      return;
    }

    if (existingMembership) {
      // User is already in the room, just redirect
      toast.error("Already in the lobby");
      setRoomName("");
      setPassword("");
      router.push(`/lobby/${room.name}`);
      return;
    }

    // Add user to room_users table
    const { error: joinError } = await supabase.from("room_users").insert({
      room_id: room.id,
      user_id: user.id,
    });

    if (joinError) {
      toast.error("Failed to join the lobby");
      return;
    }

    // Successfully joined the room
    if (room) {
      addUserRoom(room);
      toast.success("Lobby joined successfully");
      setRoomName("");
      setPassword("");
      setRoomDialogOpen(false);
      router.push(`/lobby/${room.name}`);
    } else {
      toast.error("Failed to join lobby");
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const supabase = createClient();
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Check if the name matches the pattern
    if (!/^[a-z0-9-]+$/.test(roomName)) {
      toast.error(
        "Lobby name must be lowercase letters, numbers, and hyphens.",
      );
      return;
    }

    // Type the return value of the RPC call
    const { data, error } = (await supabase.rpc("create_room_and_join", {
      room_name: roomName,
      password_hash: hashedPassword,
      user_id: user.id,
    })) as { data: CreateRoomResult | null; error: PostgrestError };

    if (error) {
      toast.error(error.message);
      return;
    }

    if (data?.error) {
      toast.error(data.error);
      return;
    }

    if (data?.room) {
      addUserRoom(data.room);
      toast.success("Room created and joined successfully");
      setRoomName("");
      setPassword("");
      setRoomDialogOpen(false);
      router.push(`/lobby/${data.room.name}`);
    } else {
      toast.error("Failed to create room");
    }
  };

  return (
    <div className="mt-4 w-full">
      <div className="space-y-2">
        <Input
          className="rounded-xl"
          type="text"
          pattern="[a-z0-9-]+" // Only allow lowercase letters, numbers, and hyphens
          autoComplete="new-text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Lobby Name"
          required
        />
        <Input
          className="rounded-xl"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Lobby Password"
          required
        />
        <div className="grid grid-cols-2 gap-2 pt-3">
          <Button onClick={handleJoinRoom} variant={"outline"}>
            Join Lobby
          </Button>
          <Button onClick={handleCreateRoom}>+ Create Lobby</Button>
        </div>
      </div>
    </div>
  );
}
