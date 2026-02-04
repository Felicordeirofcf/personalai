import { NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminCookie, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const ok = await verifyAdminCredentials(email, password);
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const token = signAdminToken();
  setAdminCookie(token);
  return NextResponse.json({ ok: true });
}
