import path from "node:path";
import { defineConfig } from "vitest/config";

// Vitest configuration for RawSpot domain tests.
// Tests live under **/__tests__/*.test.ts and run in a Node environment
// (the scoring domain is pure TS, no DOM).

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts"],
    exclude: ["node_modules", ".next", "dist"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
