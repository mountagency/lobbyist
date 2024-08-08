import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import RoomForm from "./RoomForm";

type Props = {
  className?: string;
};
export default function RoomDialog({ className }: Props) {
  return (
    <Dialog>
      <DialogTrigger className={className}>+ New lobby</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Let&apos;s get you into a lobby</DialogTitle>
        </DialogHeader>
        <RoomForm />
      </DialogContent>
    </Dialog>
  );
}
