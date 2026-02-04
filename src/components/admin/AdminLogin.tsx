"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);
    setErr(null);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);

    if (!res.ok) {
      setErr("Login inválido.");
      return;
    }
    window.location.href = "/admin";
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="space-y-1">
        <div className="text-xl font-extrabold">Admin</div>
        <div className="text-sm text-zinc-600">Entre para gerenciar pedidos.</div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Senha</Label>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {err && <div className="text-sm text-red-600">{err}</div>}
        <Button className="w-full" onClick={login} disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>
      </CardContent>
    </Card>
  );
}
