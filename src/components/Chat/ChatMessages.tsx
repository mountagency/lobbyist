import React, { Suspense } from "react";
import ListMessages from "./ListMessages";
import { createClient } from "@/utils/supabase/server";
import InitMessages from "@/lib/store/InitMessages";

export default async function ChatMessages() {
  const supabase = createClient();
  const { data } = await supabase.from("message").select("*,users(*)");

  return (
    <Suspense fallback={"loading..."}>
      <ListMessages />
      <InitMessages messages={data || []} />
    </Suspense>
  );
}
