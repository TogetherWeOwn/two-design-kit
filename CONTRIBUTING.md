# Contributing

The same contract applies to humans and AI agents.

- Work on a branch and open a PR. Never push to `main`. Name branches
  `type/short-slug`, for example `feat/ember-spacing`.
- Squash-merge only. Each PR is one logical change.
- PR title = Conventional Commits header: `type(scope): summary`, at most 100
  characters, no trailing period. Release automation reads these headers.
- Use the [PR template](.github/pull_request_template.md), in short, active
  sentences. Always fill in Attestation.
- Link a public GitHub issue with `Closes #123`, or describe the problem in
  the PR. No card reference is required.
- Keep references public-safe. No internal tracker IDs, instance links,
  private URLs, tokens or secrets in any title, body, commit, comment or
  branch name.
- Report the tests you ran. Never claim a green run you did not see.
- Token content belongs to the UX Designer. A token PR that changes values
  updates `dist/` in the same PR (`npm run build`) and names the visual
  effect in the body.
- The org contract in `TogetherWeOwn/.github` (CONTRIBUTING +
  PIPELINE-STANDARD) applies; this file's overrides win on conflict.
- Done means merged.

## Checks

`main` requires `ci-ok`, `gitleaks`, `pr-lint` and Devin Review. CodeRabbit
is advisory: answer each finding, never wait for it.
