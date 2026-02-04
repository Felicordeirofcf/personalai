// scripts/fix-next15-params.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const APP_DIR = path.join(ROOT, "src", "app");

const TARGET_FILES = new Set(["route.ts", "route.tsx", "page.tsx", "layout.tsx", "page.ts", "layout.ts"]);

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function isInAppDir(filePath) {
  const rel = path.relative(APP_DIR, filePath);
  return !rel.startsWith("..") && !path.isAbsolute(rel);
}

function shouldProcess(filePath) {
  if (!isInAppDir(filePath)) return false;
  const base = path.basename(filePath);
  if (TARGET_FILES.has(base)) return true;
  // Também pega outros .ts/.tsx dentro de src/app (muitos handlers ficam em route.ts, mas vamos garantir)
  return filePath.endsWith(".ts") || filePath.endsWith(".tsx");
}

/**
 * Insere "const params = await props.params;" no início do bloco da função
 * se ainda não existir. Mantém a lógica; só cria a variável params.
 */
function ensureAwaitParamsInBody(body) {
  const hasParamsAwait =
    /const\s+params\s*=\s*await\s+props\.params\s*;/.test(body) ||
    /const\s+params\s*=\s*await\s+context\.params\s*;/.test(body);

  if (hasParamsAwait) return body;

  // insere logo após a primeira chave "{"
  return body.replace(
    /{\s*\n?/,
    (m) => `${m}  const params = await props.params;\n`
  );
}

function ensureAwaitSearchParamsInBody(body) {
  const hasSearchAwait =
    /const\s+searchParams\s*=\s*await\s+props\.searchParams\s*;/.test(body);

  if (hasSearchAwait) return body;

  // só insere se existir props.searchParams na assinatura (vamos controlar fora)
  return body.replace(
    /{\s*\n?/,
    (m) => `${m}  const searchParams = await props.searchParams;\n`
  );
}

/**
 * Corrige handlers de rota:
 *   export async function POST(req: Request, { params }: { params: { id: string } }) { ... }
 * para:
 *   export async function POST(req: Request, props: { params: Promise<{ id: string }> }) { const params = await props.params; ... }
 *
 * Também cobre variações com "context" e tipos inline.
 */
function fixRouteHandlers(src) {
  let changed = false;

  // Padrão: export async function METHOD(req, { params }: { params: { ... } }) { ... }
  // Captura o tipo interno de params: { ... }
  const re = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s*\(\s*req\s*:\s*Request\s*,\s*{\s*params\s*}\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re, (full, method, paramsTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export async function ${method}(req: Request, props: { params: Promise<${paramsTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    return newSig + newBody;
  });

  // Variação comum: (req: Request, context: { params: { ... } }) => usa props também
  const re2 = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH|OPTIONS|HEAD)\s*\(\s*req\s*:\s*Request\s*,\s*\w+\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re2, (full, method, paramsTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export async function ${method}(req: Request, props: { params: Promise<${paramsTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    return newSig + newBody;
  });

  return { src, changed };
}

/**
 * Corrige Page/Layout:
 *   export default function Page({ params }: { params: { id: string } }) { ... }
 * para:
 *   export default async function Page(props: { params: Promise<{ id: string }> }) { const params = await props.params; ... }
 *
 * Também tenta ajustar searchParams quando tipado como objeto direto.
 */
function fixPagesAndLayouts(src) {
  let changed = false;

  // 1) default function Page({ params }: { params: { ... } })
  const re = /export\s+default\s+function\s+(\w+)\s*\(\s*{\s*params\s*}\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re, (full, name, paramsTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export default async function ${name}(props: { params: Promise<${paramsTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    return newSig + newBody;
  });

  // 2) default async function Page({ params }: { params: { ... } })
  const re2 = /export\s+default\s+async\s+function\s+(\w+)\s*\(\s*{\s*params\s*}\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re2, (full, name, paramsTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export default async function ${name}(props: { params: Promise<${paramsTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    return newSig + newBody;
  });

  // 3) caso com params + searchParams síncronos:
  // export default async function Page({ params, searchParams }: { params: {...}, searchParams: {...} }) { ... }
  const re3 =
    /export\s+default\s+(async\s+)?function\s+(\w+)\s*\(\s*{\s*params\s*,\s*searchParams\s*}\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*,\s*searchParams\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re3, (full, maybeAsync, name, paramsTypeObj, searchTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export default async function ${name}(props: { params: Promise<${paramsTypeObj}>; searchParams: Promise<${searchTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    newBody = ensureAwaitSearchParamsInBody(newBody);
    return newSig + newBody;
  });

  return { src, changed };
}

function fixAnyOtherParamDestructuring(src) {
  // Fallback simples: quando aparece "({ params }: { params: { ... } })" em funções exportadas não-default,
  // como generateMetadata, etc. Vamos corrigir também, porque costuma quebrar no Next 15.
  let changed = false;

  const re =
    /export\s+(async\s+)?function\s+(\w+)\s*\(\s*{\s*params\s*}\s*:\s*{\s*params\s*:\s*({[\s\S]*?})\s*}\s*\)\s*({[\s\S]*?^\})/gm;

  src = src.replace(re, (full, maybeAsync, name, paramsTypeObj, bodyBlock) => {
    changed = true;
    const newSig = `export async function ${name}(props: { params: Promise<${paramsTypeObj}> }) `;
    let newBody = ensureAwaitParamsInBody(bodyBlock);
    return newSig + newBody;
  });

  return { src, changed };
}

function processFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let src = original;

  let anyChanged = false;

  const r1 = fixRouteHandlers(src);
  src = r1.src;
  anyChanged ||= r1.changed;

  const r2 = fixPagesAndLayouts(src);
  src = r2.src;
  anyChanged ||= r2.changed;

  const r3 = fixAnyOtherParamDestructuring(src);
  src = r3.src;
  anyChanged ||= r3.changed;

  // Se o arquivo ainda tem destructuring do tipo antigo e usa params direto, pelo menos a gente avisa:
  const stillOld =
    /{[\s\S]*params\s*}\s*:\s*{\s*params\s*:\s*{/.test(src) ||
    /params\s*:\s*{\s*\w+\s*:\s*string/.test(src);

  if (anyChanged) {
    fs.writeFileSync(filePath, src, "utf8");
    console.log("✅ Fixed:", path.relative(ROOT, filePath));
  } else if (stillOld && filePath.includes(path.join("src", "app"))) {
    // aviso útil
    console.log("⚠️ Possibly needs manual check:", path.relative(ROOT, filePath));
  }
}

function main() {
  if (!fs.existsSync(APP_DIR)) {
    console.error("Não encontrei src/app. Caminho esperado:", APP_DIR);
    process.exit(1);
  }

  const files = walk(APP_DIR).filter(shouldProcess);
  console.log("Arquivos encontrados em src/app:", files.length);

  for (const f of files) processFile(f);

  console.log("\nPronto. Agora rode: npm run build");
}

main();
