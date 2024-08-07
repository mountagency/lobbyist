import AuthButton from "@/components/AuthButton";
import RoomForm from "@/components/Room/RoomForm";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect(`/lobby`);
  }

  return (
    <>
      <div className="mt-12 flex justify-between gap-7 px-12">
        <AuthButton />
        <RoomForm />
      </div>
    </>
  );
}
