import RoomForm from "@/components/Room/RoomForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  return (
    <>
      <div className="flex justify-between gap-7">
        <RoomForm />
      </div>
    </>
  );
}
