"use client";

import { useRoom } from "@/lib/store/roomStore";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { buttonVariants } from "../ui/button";

export default function RoomList() {
  const { rooms } = useRoom((state) => state);

  // function generateGrid(length: number) {
  //   let result = "";
  //   for (let i = 0; i < length; i++) {
  //     result += Math.floor(Math.random() * 2);
  //   }
  //   return result;
  // }

  return (
    <div className="flex flex-col gap-2">
      {rooms.map((room) => {
        // const grid = generateGrid(25);
        // const gridArray = grid.split("");
        return (
          <div key={room.id} className="flex items-center gap-2">
            {/* <div className="grid size-9 grid-cols-5 grid-rows-5 overflow-hidden rounded-lg border border-border">
              {gridArray.map((value, index) => (
                <div
                  key={index}
                  className={cn(
                    value === "0" ? "bg-indigo-200" : "bg-indigo-500",
                  )}
                ></div>
              ))}
            </div> */}
            <Link
              key={room.id}
              href={`/dashboard/lobby/${room.name}`}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "flex-1 text-left",
              )}
            >
              {room.name}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
