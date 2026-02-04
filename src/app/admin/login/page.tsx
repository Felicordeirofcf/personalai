export default function AdminLoginPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Entrar no Admin</h1>
          <p className="text-sm text-zinc-600 mt-1">Use o email e senha do .env / Render env.</p>
        </div>

        <form action="/api/admin/login" method="POST" className="space-y-3">
          <input
            name="email"
            placeholder="Email"
            className="w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
          <input
            name="password"
            placeholder="Senha"
            type="password"
            className="w-full rounded-xl border border-zinc-200 p-3 text-sm outline-none focus:ring-2 focus:ring-zinc-200"
          />
          <button className="w-full rounded-xl bg-black px-3 py-3 text-sm font-semibold text-white hover:opacity-90">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
