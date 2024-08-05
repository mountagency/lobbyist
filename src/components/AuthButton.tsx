import { useUser } from "@/lib/store/user";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AuthButton() {
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
    <div className="flex items-center gap-4">
      <span className="text-neutral-500">
        {data.user.user_metadata.full_name}
      </span>
      <form action={signOut}>
        <button className="rounded-md bg-neutral-900 px-3 py-2.5 leading-[.9] no-underline hover:bg-neutral-800">
          Logout
        </button>
      </form>
    </div>
  ) : (
    <form action={signIn}>
      <button className="rounded-md bg-neutral-900 px-3 py-2.5 leading-[.9] no-underline hover:bg-neutral-800">
        Login
      </button>
    </form>
  );
}
