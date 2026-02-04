import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const COOKIE_NAME = "admin_token";

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return false;

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as any;
    return decoded?.role === "admin";
  } catch {
    return false;
  }
}
