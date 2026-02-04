import { NextResponse } from "next/server";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const email = String(form.get("email") || "");
  const password = String(form.get("password") || "");

  const envEmail = process.env.ADMIN_EMAIL || "admin@local";
  const envPass = process.env.ADMIN_PASSWORD || "";

  if (!envPass) {
    return NextResponse.json({ ok: false, error: "ADMIN_PASSWORD não definido" }, { status: 500 });
  }

  if (email !== envEmail || password !== envPass) {
    return NextResponse.redirect(new URL("/admin/login", req.url), { status: 302 });
  }

  const token = signAdminToken();
  const res = NextResponse.redirect(new URL("/admin", req.url), { status: 302 });

  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
