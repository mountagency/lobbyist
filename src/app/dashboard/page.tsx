import RoomForm from "@/components/Room/RoomForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function UserPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <div className="flex justify-between gap-7">
        <RoomForm />
      </div>
    </>
  );
}
