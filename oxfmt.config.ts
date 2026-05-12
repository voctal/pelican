import { defineConfig } from "oxfmt";

export default defineConfig({
    printWidth: 120,
    arrowParens: "avoid",
    tabWidth: 4,
    sortTailwindcss: true,
    sortImports: {
        newlinesBetween: false,
    },
    ignorePatterns: ["node_modules", "dist", "dist-docs", "package-lock.json"],
});
