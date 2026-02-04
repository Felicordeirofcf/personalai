import { NextResponse } from "next/server";
import { verifyAdminCredentials, setAdminCookie, signAdminToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!verifyAdminCredentials(String(email || ""), String(password || ""))) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    await setAdminCookie(res, signAdminToken());
    return res;
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? "Erro" }, { status: 400 });
  }
}
