import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function getProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data as Profile;
}

export async function ensureProfile(
  userId: string,
  email: string
): Promise<void> {
  const service = createServiceClient();
  const { data } = await service
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .single();

  if (!data) {
    await service.from("profiles").insert({
      id: userId,
      email,
      role: "patient",
    });
  }
}

export async function requireAuth() {
  const profile = await getProfile();
  if (!profile) {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Forbidden");
  }
  return profile;
}
