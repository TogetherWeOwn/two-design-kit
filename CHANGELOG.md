# Changelog

Release notes for each tag are also on the GitHub release. Versions follow semver; while the kit is `0.x`, a removed or renamed token bumps the minor version.

## v0.4.0

**Breaking: the workbench is no longer part of this kit.** The kit is the design of the TWO product (two-web-next and two-bot-next) only. The workbench tool-surface design added in v0.3.0 belongs to labelloop and now lives in its own repo: [TogetherWeOwn/labelloop `docs/design/`](https://github.com/TogetherWeOwn/labelloop/tree/main/docs/design).

Removed:

- components.md §J (J1–J22);
- templates.md layout patterns P6 and P7 and the tool-surface rules;
- voice.md §7 (tool surfaces);
- accessibility.md §4's box-handle target exception: the 36 px house minimum now has no exceptions;
- tokens `color.machine`, `color.well`, `color.bg.well`, `color.label.*`, `box.dash.*`, `size.target-handle`, `size.box.*`, `size.crop.tile`, `size.toolbar`, `layout.inspector` and `layout.queue`, with their contrast pairs.

**Migration:** none for two-web-next or two-bot-next; neither uses a removed token. `dist/` is byte-identical to v0.2.3. Anything that used a removed token takes it from labelloop `docs/design/` instead.
