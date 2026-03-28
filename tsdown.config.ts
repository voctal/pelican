import { defineConfig } from "tsdown";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm", "cjs"],
    target: "es2022",
    treeshake: true,
    sourcemap: true,
    clean: true,
    dts: true,
    outDir: "dist",
});
