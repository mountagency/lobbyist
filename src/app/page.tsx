import AuthButton from "@/components/AuthButton";
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
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="mb-8 translate-x-[.2em] text-[clamp(3rem,7vw,6rem)] font-medium">
        Lobbyist<span className="font-medium text-neutral-500">™</span>
      </h1>
      <div className="flex justify-between gap-7">
        <AuthButton className="bg-indigo-500 text-foreground shadow-[0_5px_25px_-5px] shadow-indigo-400/60" />
      </div>
    </div>
  );
}
