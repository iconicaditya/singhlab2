import { build as esbuild } from "esbuild";
import { build as viteBuild } from "vite";
import { rm, readFile, cp } from "fs/promises";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function buildAll() {
  await rm("dist", { recursive: true, force: true });

  console.log("building client...");
  await viteBuild();

  console.log("building server...");
  
  const pkg = JSON.parse(await readFile("package.json", "utf-8"));
  const allDeps = Object.keys(pkg.dependencies || {});
  const externals = allDeps.filter((dep) => 
    !["esbuild", "tsx"].includes(dep)
  );

  // Bundle server code with dependencies marked as external
  await esbuild({
    entryPoints: ["server/index.ts"],
    platform: "node",
    target: "node18",
    bundle: true,
    format: "esm",
    outfile: "dist/server/index.js",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    minify: false,
    sourcemap: false,
    external: externals,
    logLevel: "info",
  });

  // Copy shared files
  await cp("shared", "dist/shared", { recursive: true });
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
