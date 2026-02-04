import "server-only";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "admin_token";

export const ADMIN_COOKIE_NAME = COOKIE_NAME;

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

/** ✅ Compat: seu login antigo usa JSON {email,password} */
export function verifyAdminCredentials(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL || "admin@local";
  const envPass = process.env.ADMIN_PASSWORD || "";
  if (!envPass) return false;
  return email === envEmail && password === envPass;
}

/** ✅ Compat: setAdminCookie(response, token?) */
export async function setAdminCookie(res: NextResponse, token?: string) {
  const t = token ?? signAdminToken();

  res.cookies.set({
    name: COOKIE_NAME,
    value: t,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
