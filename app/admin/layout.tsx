import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getProfile();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/upload");

  return (
    <div className="page-bg flex flex-col">
      <div className="page-blob-tl" />
      <div className="page-blob-br" />
      <Navbar user={user} />
      <main className="flex-1 relative z-10">{children}</main>
    </div>
  );
}
