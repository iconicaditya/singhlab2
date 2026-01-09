import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "../public");
  const rootDistPath = path.resolve(__dirname, "../../dist/public");
  
  // Try both possible paths for static files
  const actualDistPath = fs.existsSync(distPath) ? distPath : (fs.existsSync(rootDistPath) ? rootDistPath : null);

  if (!actualDistPath) {
    log("Dist directory not found. This is expected in development but problematic in production.", "static");
    return;
  }

  app.use(express.static(actualDistPath));

  //SPA Fallback
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(actualDistPath, "index.html"));
  });
}
