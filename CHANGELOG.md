# Changelog

Release notes for each tag are also on the GitHub release. Versions follow semver as AGENTS.md §5 sets out: a changed token value is a minor bump; a removed or renamed token is a major bump.

## v1.0.1

**Docs patch: the Echo tag has its own fill.** components.md A4 `echo` now sets the label in `state.echo` on an opaque `state.echo-bg` fill, with the `state.echo` outline at 50%. The fill keeps the label at 4.52:1 (the existing tokens §1.8 pair) on any ground. The A4 table gains a Fill column; every other tag has none. The placement rule (grounds 0–2, never `bg.overlay`, tokens §1.5) is unchanged.

The mockup CSS (`.tag.ech`) matches, and the profile and events full-page PNGs are re-rendered; only the Echo tags change. docs/README now says to render with full Chromium, not Playwright's headless shell, whose text metrics differ from the committed PNGs.

**Migration:** none. No token changes; `dist/` is unchanged. two-web-next already implements the fill.

## v1.0.0

**Breaking: the workbench is no longer part of this kit.** The kit is the design of the TWO product (two-web-next and two-bot-next) only. The workbench tool-surface design added in v0.3.0 belongs to labelloop and now lives in its own repo: [TogetherWeOwn/labelloop `docs/design/`](https://github.com/TogetherWeOwn/labelloop/tree/main/docs/design).

Removed:

- components.md §J (J1–J22);
- templates.md layout patterns P6 and P7 and the tool-surface rules;
- voice.md §7 (tool surfaces);
- accessibility.md §4's box-handle target exception: the 36 px house minimum now has no exceptions;
- tokens `color.machine`, `color.well`, `color.bg.well`, `color.label.*`, `box.dash.*`, `size.target-handle`, `size.box.*`, `size.crop.tile`, `size.toolbar`, `layout.inspector` and `layout.queue`, with their contrast pairs.

**Migration:** none for two-web-next or two-bot-next; neither uses a removed token. `dist/` is byte-identical to v0.2.3. Anything that used a removed token takes it from labelloop `docs/design/` instead.
