import SideBar from "@/components/SideBar";
import "@/styles/globals.css";
import { createClient } from "@/utils/supabase/server";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lobbyist™ Home",
  description: "A Mount™ lobby application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function LobbyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  return (
    <section className="flex">
      <SideBar />
      <main className="flex min-h-screen flex-col py-3">{children}</main>
    </section>
  );
}
