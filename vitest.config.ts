import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { loadEnv } from "vite";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "node",
    environmentMatchGlobs: [
      ["./src/test/app/**", "jsdom"],
      ["./src/test/server/**", "node"],
      ["./src/test/api/**", "node"],
      ["./src/test/trpc/**", "node"],
    ],
    // mode defines what ".env.{mode}" file to choose if exists
    env: loadEnv("", process.cwd(), ""),
  },
});
