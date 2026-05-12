import { defineConfig } from "oxlint";

export default defineConfig({
    options: { typeAware: true, typeCheck: true },
    plugins: ["eslint", "typescript", "unicorn", "oxc", "jsdoc", "node", "promise"],
    env: {
        builtin: true,
        node: true,
    },
    categories: {
        correctness: "error",
        nursery: "warn",
        pedantic: "off",
        perf: "warn",
        restriction: "off",
        style: "off",
        suspicious: "warn",
    },
    ignorePatterns: ["node_modules", "dist", "dist-docs", "package-lock.json"],
    rules: {
        "no-explicit-any": "error",
        "prefer-readonly-parameter-types": "off",
        "no-unsafe-enum-comparison": "off",
        "strict-void-return": "off",
        "prefer-optional-chain": "off",
        "no-unnecessary-type-arguments": "off",
        "no-shadow": "off",
        "no-await-in-loop": "off",
    },
});
