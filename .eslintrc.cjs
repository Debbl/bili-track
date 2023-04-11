// @ts-check
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  extends: [
    "next/core-web-vitals",
    "@debbl/eslint-config-react",
    "@debbl/eslint-config-prettier",
  ],
});
