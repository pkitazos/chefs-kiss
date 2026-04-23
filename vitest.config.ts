import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    exclude: ["node_modules", ".next"],
  },
});
