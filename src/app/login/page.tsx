import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default function Login() {
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

  return (
    <form action={signIn} className="flex">
      <button className="rounded-lg border-neutral-800 bg-neutral-900 p-3 font-medium leading-none">
        Sign in with Discord
      </button>
    </form>
  );
}
