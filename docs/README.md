# Ember Hours design kit: docs

Start with [AGENTS.md](../AGENTS.md). Then:

1. [tokens.md](tokens.md): colour roles and every contrast pair, type, space, radius, elevation, grid and breakpoints, motion and reduced motion, icons, and the mapping to today's code.
2. [components.md](components.md): every component with anatomy, sizing, states, content rules and accessible name and role.
3. [templates.md](templates.md): home (guest and member), events, event detail with Lifeline, ladder, members, profile, join and admin, at 1280 and 390.
4. [voice.md](voice.md): voice, mechanics, word list, do and don't.
5. [accessibility.md](accessibility.md): WCAG 2.2 AA rules and the checks a PR runs.
6. [discord.md](discord.md): embed colours and anatomy, field patterns, the bot-log line format, Echo and Lifeline messages, buttons.
7. Workbench (tool surfaces such as labelloop): components J1–J22 in [components.md](components.md) §J, patterns P6 and P7 in [templates.md](templates.md), tool copy in [voice.md](voice.md) §7, provenance tokens in [tokens.md](tokens.md) §1.8.
8. [idea-bank.md](idea-bank.md): ideas from Living Lobby, the recommended mix and concepts A/B of both runs. Not for building now.

Visual reference: `mockups/png/` (8 surfaces × 1280 and 390, regenerated from `dist/css/tokens.css`; fixture names and numbers are invented). Sources in `mockups/src/`. To regenerate: `npm i --no-save playwright axe-core` in the repo root (or set `REPO` to a checkout that has them, and `CHROMIUM` to a browser binary), put the latin woff2 subsets of Mona Sans, Instrument Serif and Fragment Mono in `mockups/src/fonts/` (file names in `fonts.css`; OFL, not committed), then `cd mockups/src && for f in build-*.cjs; do node $f; done`, `node shot.cjs <page>.html ../png/<page>` and `node axe.cjs *.html` (exits 1 on any WCAG 2.0–2.2 A/AA or best-practice violation).

Source of the design: the Ember Hours custom design and its visual-direction concept, chosen by the owner on 2026-11-03.
