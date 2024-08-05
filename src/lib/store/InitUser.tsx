"use client";

import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { useUser } from "./userStore";

export default function InitUser({ user }: { user: User | null }) {
  const initState = useRef(false);
  useEffect(() => {
    if (!initState.current) {
      useUser.setState({ user });
    }

    initState.current = true;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
