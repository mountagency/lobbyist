import { useUser } from "@/lib/store/userStore";
import { createClient } from "@/utils/supabase/server";

type UserMetaData = {
  custom_claims: {
    global_name: string;
  };
};

export default async function UserPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return (
    <div className="flex h-full w-full items-center justify-center">
      <h1 className="text-5xl font-medium">
        Hi, {(user?.user_metadata as UserMetaData).custom_claims.global_name} 👋
      </h1>
    </div>
  );
}
