"use client";

import { useEffect, useRef } from "react";
import { Room, useRoom } from "./roomStore";

type InitRoomsProps = {
  initialRooms: Room[];
};

export default function InitRooms({ initialRooms }: InitRoomsProps) {
  const initState = useRef(false);
  const { setUserRooms } = useRoom();

  useEffect(() => {
    if (!initState.current) {
      setUserRooms(initialRooms);
      initState.current = true;
    }
  }, [initialRooms, setUserRooms]);

  return null;
}
