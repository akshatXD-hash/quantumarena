import { redirect } from "next/navigation";
import { getProfile } from "@/lib/auth";

export default async function RootPage() {
  const user = await getProfile();
  if (!user) redirect("/login");
  redirect("/upload");
}
