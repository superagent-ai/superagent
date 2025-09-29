import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    environment: "node",
    setupFiles: ["tests/setup.ts"],
  },
  resolve: {
    alias: {
      "superagent-ai": resolve(__dirname, "src/index.ts"),
    },
  },
});
