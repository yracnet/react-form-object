import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "react-form-object": path.resolve("../src"),
    },
  },
  plugins: [react()],
});
