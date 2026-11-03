# Authoring tokens

Tokens live in `*.tokens.json` files in this directory, in W3C Design Tokens
(DTCG) format: every leaf has `$value`, every group sets `$type` once, and
aliases use `{path.to.token}` references (see `alias.tokens.json`).

- `color.tokens.json`: primitives (grounds, text ramp, ember, state, avatar discs, scrims).
- `roles.tokens.json`: colour roles components use (`color.bg.*`, `color.text.*`, `color.line.*`,
  `color.accent.*`, `color.focus.*`, `color.state.*`, `color.rank.*`), the brand gradient and
  elevation. Components use roles, never primitives.
- `discord.tokens.json`: embed colours by meaning and Discord limits (two-bot-next).
- `alias.tokens.json`: site role aliases. Existing stylesheets keep working:
  each alias resolves to one primitive, so only values change downstream.
- `dimension.tokens.json`: 4 px spacing scale and insets, radii, sizes, layout, breakpoints,
  type sizes and tracking.
- `font.tokens.json`: OFL stacks, weights, widths and line heights. No font binaries live in
  this repo.
- `motion.tokens.json`: one easing, four durations in milliseconds, the enter distance and the
  live-data poll cadence.
- `contrast.json`: not tokens. The declared colour-role pairs for the WCAG
  2.2 AA gate (`npm run contrast`). Exclusions are deliberate design rules
  with a reason, never gaps.

File provenance: seeded from the Ember Hours custom design for v0.1.0. The
UX Designer owns token content after that. Keep the licensed base theme's
files and name out of this directory.

What each token is for, and the component specs that use it: [docs/tokens.md](../docs/tokens.md).
