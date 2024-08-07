import SideBar from "@/components/navigation/SideBar";
import "@/styles/globals.css";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Lobbyist™ Dashboard",
  description: "A Mount™ lobby application",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <section className="flex">
      <SideBar />
      <main className="flex min-h-screen flex-col py-3">{children}</main>
    </section>
  );
}
