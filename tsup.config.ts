import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.tsx", "src/parse.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    external: ["react", "react-dom"],
    dts: {
      resolve: true,
    },
    clean: true,
    sourcemap: false,
  },
]);
