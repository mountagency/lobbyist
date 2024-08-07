"use client";

import React, { useEffect, useRef } from "react";
import { Room, useRoom } from "./roomStore";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

type InitRoomsProps = {
  roomsData: PostgrestSingleResponse<Room[]>;
};

export default function InitRooms({ roomsData }: InitRoomsProps) {
  const initState = useRef(false);

  useEffect(() => {
    if (!initState.current) {
      if (roomsData.error) {
        console.error("Error fetching rooms:", roomsData.error);
        return;
      }

      const rooms = roomsData.data || [];
      useRoom.setState({ rooms });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
