import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const validEmail = process.env.ADMIN_EMAIL || "admin@local";
    const validPass = process.env.ADMIN_PASSWORD || "admin";

    if (email !== validEmail || password !== validPass) {
      return NextResponse.json(
        { error: "Credenciais inválidas" },
        { status: 401 }
      );
    }

    const secret = process.env.JWT_SECRET || "segredo";
    const cookieStore = await cookies();
    
    cookieStore.set("admin_session", secret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno" },
      { status: 500 }
    );
  }
}