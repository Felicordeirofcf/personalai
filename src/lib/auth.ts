import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "admin_token";

export async function requireAdmin(): Promise<boolean> {
  const secret = process.env.JWT_SECRET || "";
  if (!secret) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return false;

  try {
    jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export function signAdminToken() {
  const secret = process.env.JWT_SECRET || "";
  const email = process.env.ADMIN_EMAIL || "admin@local";
  return jwt.sign({ role: "admin", email }, secret, { expiresIn: "7d" });
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
