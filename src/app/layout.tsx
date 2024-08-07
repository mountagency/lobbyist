import InitRooms from "@/lib/store/InitRooms";
import InitUser from "@/lib/store/InitUser";
import { Room } from "@/lib/store/roomStore";
import "@/styles/globals.css";
import { createClient } from "@/utils/supabase/server";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Lobbyist™",
  description: "A Mount™ lobby application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRooms: Room[] = [];
  if (user) {
    const { data, error } = await supabase
      .from("room_users")
      .select("rooms(*)")
      .eq("user_id", user.id);

    if (!error && data) {
      userRooms = data
        .map((item) => item.rooms)
        .filter((room): room is Room => room !== null);
    }
  }

  return (
    <>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="dark">
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster position="top-right" />
          <InitUser user={user} />
          <InitRooms initialRooms={userRooms} />
        </body>
      </html>
    </>
  );
}
