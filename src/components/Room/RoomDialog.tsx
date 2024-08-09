"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RoomForm from "./RoomForm";
import { useRoom } from "@/lib/store/roomStore";

type Props = {
  className?: string;
};
export default function RoomDialog({ className }: Props) {
  const { roomDialogOpen, setRoomDialogOpen } = useRoom();

  return (
    <Dialog open={roomDialogOpen} onOpenChange={setRoomDialogOpen}>
      <DialogTrigger className={className}>+ New Lobby</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Let&apos;s get you into a Lobby</DialogTitle>
        </DialogHeader>
        <RoomForm />
      </DialogContent>
    </Dialog>
  );
}
