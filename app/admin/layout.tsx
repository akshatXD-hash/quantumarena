import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getProfile();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/upload");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
