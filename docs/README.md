# Ember Hours design kit: docs

Start with [AGENTS.md](../AGENTS.md). Then:

1. [tokens.md](tokens.md): colour roles and every contrast pair, type, space, radius, elevation, grid and breakpoints, motion and reduced motion, icons, and the mapping to today's code.
2. [components.md](components.md): every component with anatomy, sizing, states, content rules and accessible name and role.
3. [templates.md](templates.md): home (guest and member), events, event detail with Lifeline, ladder, members, profile, join and admin, at 1280 and 390.
4. [voice.md](voice.md): voice, mechanics, word list, do and don't.
5. [accessibility.md](accessibility.md): WCAG 2.2 AA rules and the checks a PR runs.
6. [discord.md](discord.md): embed colours and anatomy, field patterns, the bot-log line format, Echo and Lifeline messages, buttons.
7. [idea-bank.md](idea-bank.md): ideas from Living Lobby, the recommended mix and concepts A/B of both runs. Not for building now.

Visual reference: `mockups/png/` (8 surfaces × 1280 and 390, regenerated from `dist/css/tokens.css`; fixture names and numbers are invented). Sources in `mockups/src/` (`node build-*.cjs`, then `shot.cjs` and `axe.cjs` with Playwright and axe-core from a checkout that has them, `REPO=<that checkout>`). The OFL font files are not in this repo: put the latin woff2 subsets of Mona Sans, Instrument Serif and Fragment Mono in `mockups/src/fonts/` (names in `fonts.css`) before rendering.

Source of the design: the Ember Hours custom design and its visual-direction concept, chosen by the owner on 2026-11-03.
