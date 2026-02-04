import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
