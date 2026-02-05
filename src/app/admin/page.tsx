import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { OrdersTable } from "@/components/OrdersTable"; // ✅ Importamos o componente inteligente aqui

// Função simples para checar login
async function checkAuth() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("admin_session");
  const secret = process.env.JWT_SECRET || "segredo";
  
  if (!authCookie || authCookie.value !== secret) {
    return false;
  }
  return true;
}

export default async function AdminDashboard() {
  // 1. Verifica Segurança
  const isAuth = await checkAuth();
  if (!isAuth) {
    redirect("/admin/login");
  }

  // 2. Busca TODOS os pedidos (Server Side)
  // O Next.js busca isso no servidor antes de enviar a página
  const orders = await prisma.order.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen bg-zinc-50 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* O Título e contadores agora estão dentro ou acima do componente, 
            mas podemos manter um container limpo aqui */}
        
        {/* 3. Renderiza a Tabela Interativa */}
        {/* Passamos os dados do banco (orders) para o componente Cliente */}
        <OrdersTable initialOrders={orders} />
      </div>
    </div>
  );
}