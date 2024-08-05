import ChatSection from "@/components/Chat/ChatSection";
import InitUser from "@/lib/store/InitUser";
import { createClient } from "@/utils/supabase/server";

export default async function HomePage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <div className="mt-12">
        <ChatSection user={data.user} />
      </div>
      <InitUser user={data.user} />
    </>
  );
}
