import AuthButton from "@/components/AuthButton";
import InitRooms from "@/lib/store/InitRooms";
import InitUser from "@/lib/store/InitUser";
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

  const roomsData = await supabase.from("rooms").select("*");

  return (
    <>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body className="dark">
          <main className="flex min-h-screen flex-col">{children}</main>
          <Toaster position="top-right" />
        </body>
      </html>
      <InitUser user={user} />
      <InitRooms roomsData={roomsData} />
    </>
  );
}
