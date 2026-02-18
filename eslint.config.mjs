import { defineConfig, globalIgnores } from "eslint/config";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintNextPlugin from "@next/eslint-plugin-next";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  eslintNextPlugin.configs.recommended,
  {
    plugins: {
      react,
    },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      "no-console": [
        "warn",
        {
          allow: ["warn", "error"],
        },
      ],
    },
  },
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "**/*.mjs",
    "**/*.cjs",
  ]),
]);
