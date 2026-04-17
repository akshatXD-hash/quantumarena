import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "PATIENT" | "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "PATIENT" | "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PATIENT" | "ADMIN";
  }
}
