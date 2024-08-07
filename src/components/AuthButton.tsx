import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";
import { EllipsisVertical, LogOut } from "lucide-react";

type Props = {
  className?: string;
};
export default async function AuthButton({ className }: Props) {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  const signOut = async () => {
    "use server";

    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/");
  };

  const signIn = async () => {
    "use server";

    const supabase = createClient();
    const origin = headers().get("origin");

    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(error);
    } else {
      return redirect(data.url);
    }
  };

  return data?.user ? (
    <div className="flex items-center justify-between gap-4">
      <div className="ml-2 flex items-center gap-4">
        <div className="size-6 overflow-hidden rounded-full">
          <Image
            src={data.user.user_metadata.avatar_url as string}
            alt={`User image: ${data.user.user_metadata.full_name as string}`}
            width={128}
            height={128}
          />
        </div>
        <span className="text-sm text-neutral-500">
          {data.user.user_metadata.full_name}
        </span>
      </div>
      <div className="flex">
        <form action={signOut}>
          <Button variant={"ghost"} className="h-auto p-2.5">
            <LogOut size={14} />
          </Button>
        </form>
        <Button variant={"ghost"} className="h-auto p-2.5">
          <EllipsisVertical size={14} />
        </Button>
      </div>
    </div>
  ) : (
    <form action={signIn}>
      <Button className={className}>Login with Discord</Button>
    </form>
  );
}
