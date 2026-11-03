// Style Dictionary 4 DTCG build configuration.
// Tokens are authored in W3C Design Tokens format under tokens/.
// scripts/build.mjs registers the formats and sets the output root
// (dist/ by default, redirected with OUT_DIR for the drift check).
export const source = ["tokens/*.tokens.json"];

export const platformFiles = {
  css: [{ destination: "tokens.css", format: "css/two-tokens" }],
  ts: [{ destination: "tokens.ts", format: "ts/two-tokens" }],
  rust: [{ destination: "brand_tokens.rs", format: "rust/brand-tokens" }],
};
