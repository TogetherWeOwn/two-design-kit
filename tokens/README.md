# Authoring tokens

Tokens live in `*.tokens.json` files in this directory, in W3C Design Tokens
(DTCG) format: every leaf has `$value`, every group sets `$type` once, and
aliases use `{path.to.token}` references (see `alias.tokens.json`).

- `color.tokens.json`: primitives (grounds, text ramp, ember, state).
- `alias.tokens.json`: site role aliases. Existing stylesheets keep working:
  each alias resolves to one primitive, so only values change downstream.
- `dimension.tokens.json`: 4 px spacing scale, radii, grid, fluid type sizes.
- `font.tokens.json`: OFL stacks only. No font binaries live in this repo.
- `motion.tokens.json`: one easing, four durations in milliseconds.
- `contrast.json`: not tokens. The declared colour-role pairs for the WCAG
  2.2 AA gate (`npm run contrast`). Exclusions are deliberate design rules
  with a reason, never gaps.

File provenance: seeded from the Ember Hours custom design for v0.1.0. The
UX Designer owns token content after that. Keep the licensed base theme's
files and name out of this directory.
