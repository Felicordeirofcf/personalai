import "server-only";
import { cookies } from "next/headers";

// Mesma checagem usada em /admin (cookie definido em /api/admin/login)
export async function isAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_session");
  const secret = process.env.JWT_SECRET || "segredo";
  return !!authCookie && authCookie.value === secret;
}
