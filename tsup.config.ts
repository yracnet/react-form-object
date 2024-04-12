import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.tsx", "src/parse.ts"],
    format: ["cjs", "esm", "iife"],
    outDir: "dist",
    external: ["react", "react-dom"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
