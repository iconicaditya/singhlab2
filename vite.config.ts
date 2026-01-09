import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { metaImagesPlugin } from "./vite-plugin-meta-images";

const basePlugins = [
  react(),
  tailwindcss(),
  metaImagesPlugin(),
];

const replicPlugins =
  process.env.REPL_ID !== undefined
    ? await Promise.all([
        import("@replit/vite-plugin-runtime-error-modal")
          .then((m) => m.default())
          .catch(() => null),
        import("@replit/vite-plugin-cartographer")
          .then((m) => m.cartographer())
          .catch(() => null),
        import("@replit/vite-plugin-dev-banner")
          .then((m) => m.devBanner())
          .catch(() => null),
      ]).then((plugins) => plugins.filter(Boolean))
    : [];

export default defineConfig({
  base: "/",
  plugins: [...basePlugins, ...replicPlugins],
  esbuild: {
    supported: {
      'top-level-await': true
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
