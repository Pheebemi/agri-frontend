import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescriptConfig from "eslint-config-next/typescript";

// eslint-config-next 16 ships native flat configs, so these are spread
// directly — FlatCompat is not needed and in fact chokes on them.
const eslintConfig = [
  ...coreWebVitals,
  ...typescriptConfig,
  {
    rules: {
      // The unDraw illustrations are static SVGs. next/image adds nothing and
      // would need hardcoded dimensions — see CLAUDE.md §7.
      "@next/next/no-img-element": "off",
    },
  },
  { ignores: [".next/**", "node_modules/**", "out/**", "next-env.d.ts"] },
];

export default eslintConfig;
