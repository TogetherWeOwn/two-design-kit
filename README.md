# two-design-kit

The single source of truth for TogetherWeOwn design. Tokens are authored in
[W3C Design Tokens (DTCG)](https://www.designtokens.org/) format under
`tokens/`, and a [Style Dictionary 5](https://styledictionary.com/) build
emits them for every consumer:

| Output | File | Consumer |
|---|---|---|
| CSS custom properties + reduced-motion layer | `dist/css/tokens.css` | two-web-next |
| Typed, tree-shakeable TypeScript | `dist/ts/tokens.ts` | two-web-next |
| Brand colours as `u32` for Discord embeds | `dist/rust/brand_tokens.rs` | two-bot-next |

Current theme: **Ember Hours** (seeded in v0.1.0; the UX Designer owns token
content after that). 

## The design kit

Building a page, component or bot surface? Start with [AGENTS.md](AGENTS.md).

| Need | Read |
|---|---|
| A colour, size, font, space or motion value, and every contrast pair | [docs/tokens.md](docs/tokens.md) |
| A component, its states, and its accessible name and role | [docs/components.md](docs/components.md) |
| A page layout at 390 and 1280 | [docs/templates.md](docs/templates.md) |
| Words | [docs/voice.md](docs/voice.md) |
| WCAG 2.2 AA rules and the checks a PR runs | [docs/accessibility.md](docs/accessibility.md) |
| Discord embeds, buttons and the bot-log line format | [docs/discord.md](docs/discord.md) |
| Ideas that are not in the build | [docs/idea-bank.md](docs/idea-bank.md) |
| What it should look like | [`mockups/png/`](mockups/png) (rendered from `dist/css/tokens.css`) |

New components use the role tokens (`--two-color-bg-*`, `--two-color-text-*`,
`--two-color-state-*`); the `role.*` aliases below stay for existing stylesheet hooks.

## Pinning and updating (vendored `dist/`)

Consumers vendor the built files; they never run this build. Each consumer
pins a release tag and copies exactly three files. Rationale: both product
repos already vendor generated artefacts with drift gates, a tag pin is one
line to audit, and no package registry or git-dependency fetch runs at
deploy time.

### two-web-next (CSS + TS)

Pin a tag (for example `v0.1.0`), then sync:

```sh
KIT_TAG=v0.1.0
KIT=vendor/design-kit
mkdir -p "$KIT"
curl -fsSL -o "$KIT/tokens.css" \
  "https://raw.githubusercontent.com/TogetherWeOwn/two-design-kit/$KIT_TAG/dist/css/tokens.css"
curl -fsSL -o "$KIT/tokens.ts" \
  "https://raw.githubusercontent.com/TogetherWeOwn/two-design-kit/$KIT_TAG/dist/ts/tokens.ts"
printf '%s\n' "$KIT_TAG" > "$KIT/VERSION"
```

The web repo keeps a drift test that re-downloads the two files at the
pinned tag and diffs them against `vendor/design-kit/`. Updating is a
one-line change to `VERSION` (plus the re-vendored files) in a normal PR.

Site variable mapping: role aliases drop the `role` segment, so `role.page`
builds to `--two-page`. The mapping to the existing stylesheet hooks is:

| Stylesheet hook | Kit variable |
|---|---|
| `--color-page` | `--two-page` |
| `--color-surface` | `--two-surface` |
| `--color-text` | `--two-text` |
| `--color-muted` | `--two-muted` |
| `--color-accent` | `--two-accent` |
| `--color-border` | `--two-control-border` |

### two-bot-next (Rust)

```sh
KIT_TAG=v0.1.0
curl -fsSL -o crates/discord/src/brand_tokens.rs \
  "https://raw.githubusercontent.com/TogetherWeOwn/two-design-kit/$KIT_TAG/dist/rust/brand_tokens.rs"
```

The bot repo keeps a drift test that compares the vendored file against the
tag, and declares the mapping once in `crates/discord/src/brand.rs`:

```rust
// Re-export the kit's colours under bot names.
pub use crate::brand_tokens::{BRAND_COLOR_EMBER as EMBED_ACCENT, BRAND_COLOR_LIVE as EMBED_LIVE};
```

## Developing

```sh
npm ci --include=dev
npm run validate   # DTCG schema shape, types and reference resolution
npm run build      # regenerate dist/ from tokens/
npm run drift      # fail if committed dist/ differs from a fresh build
npm run contrast   # WCAG 2.2 AA over the declared pairs in tokens/contrast.json
npm run check:ts   # typecheck the generated TypeScript
npm test           # output acceptance tests
npm run lint       # Biome gate
```

`dist/` is committed. After editing `tokens/`, run `npm run build` and
commit the result; CI fails on drift.

`.npmrc` turns off dependency install scripts and refuses releases younger
than three days when npm resolves a new version. Named commands such as
`npm run build` still run.

## Releases

Semver tags (`v0.x.y`) with a release note. Tagging a release:

```sh
npm run check
git tag -a v0.1.0 -m "Ember Hours seed: CSS, TS and Rust token outputs"
git push origin v0.1.0
```

Consumers pin the tag (see above) and update by moving the pin.

## Design rules the build enforces

- **One accent, rationed.** Ember (`#ff9c36`) is the only accent.
- **Echo rule.** Violet Echo text never sits on ground 3; Echo tags live on
  grounds 0-2. The contrast gate skips that pair deliberately (see
  `tokens/contrast.json` exclusions) and every other text pair must reach
  4.5:1.
- **Reduced motion.** The CSS ships a `prefers-reduced-motion: reduce` layer
  that zeroes every duration; motion tokens are never consumed outside a
  `no-preference` guard.
- **Dark only for v1.** `color-scheme: dark` is set; light roles can be added
  later without touching components.
- **Fonts stay OFL.** Mona Sans, Instrument Serif and Fragment Mono are SIL
  Open Font License families. Their licence files ship with the font files
  when they are added; no font binaries are vendored in this repo.
