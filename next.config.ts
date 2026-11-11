import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // O PDF das planilhas lê a logo do disco; garante que ela vá junto na função (Vercel)
  outputFileTracingIncludes: {
    "/api/planilhas/download/[purchaseId]": ["./public/logo.png"],
  },
};

export default nextConfig;
