# Agent Instructions

## Project Commands

Use Vite+ (`vp`) for project commands and package management. Use `vpr <script-or-task>` for package scripts and Vite Tasks. If you do not have the global CLI, invoke the project-local CLI with `pnpm exec vp`.

- `vp check` runs formatting, lint, and type checks; use `vp lint --format=github` for GitHub Actions annotations.
- `vpr typecheck` runs the workspace TypeScript checks.
- `vpr test` runs unit and integration tests.
- `vpr e2e` runs Playwright end-to-end tests.
- `vpr schemas:build` builds the schemas package.
- `vpr bench:all` runs all benchmark suites through Vite Task.
- `vpr website:dev` starts the website locally.

Use `vp run <task>` (or its `vpr <task>` shorthand) for tasks configured in `vite.config.ts` or package scripts. `vp dev`, `vp build`, `vp test`, and `vp pack` are built-in Vite+ commands; use `vp run <name>` when you intend to run a package script or Vite Task with that name. Without global Vite+, use `pnpm exec vp run <task>`.

Run the narrowest relevant command first, then broaden validation when the change warrants it.

## Repository Areas

- `schemas/` contains validation-library adapters and schema definitions.
- `bench/` contains benchmark runners and result generation.
- `website/` contains the frontend and end-to-end tests.
- `json-schema-tests/` contains the JSON Schema compliance suite.
- `utils/` contains shared utilities used across packages.

Keep changes in the package that owns the behavior. Follow neighboring implementations before introducing new abstractions.

## Common Changes

When adding a validation library:

1. Add the dependency to the `schemas` package.
2. Add a library folder under `schemas/libraries/`.
3. Add its schema definition and benchmark definitions.
4. Add download benchmarks matching typical library usage.
5. Add a `types/index.ts` (schema plus `Input`/`Output` aliases, or a `noInference` reason) and a `types/fromType.ts` (a `style` plus a schema built against the shared `Product` type) when applicable.
6. Run `vpr schemas:build` and the relevant benchmark commands (for example, `vpr bench:all`).

Use existing library folders as templates and preserve the library's idiomatic API in the adapter.

## Testing Conventions

- Use `*.node.test.ts` for Node.js behavior.
- Use `*.browser.test.ts(x)` for DOM-specific behavior.
- Use `*.test-d.ts` for complex TypeScript typing behavior.

Prefer focused tests for the changed package before running the repository-wide checks. Update tests when changing behavior or public contracts.

When available, prefer using VSCode's built-in test runner instead of CLI commands.

## Generated Files and External Data

Do not edit generated files manually when a repository command can regenerate them. Check the owning package scripts and nearby documentation for the generation command.

Benchmark output and external API data can be regenerated or refreshed by scripts. Avoid committing incidental output changes unless the change requires them or the existing workflow expects them.

## Style and Scope

- Follow the existing TypeScript, React, and package-local patterns.
- Use Vite+ for linting and formatting.
- Avoid unrelated refactors, dependency upgrades, and formatting churn.
- Preserve existing public APIs unless the task explicitly requires a breaking change.
- Do not add inline comments unless they clarify non-obvious behavior.

## Git and Contributions

Read `CONTRIBUTING.md` for setup, Git etiquette, library contribution details, and pull request expectations. In particular, prefer a linear history without merge commits.

AI assistance is welcome for speeding up work, but every change must be reviewed and tested by a human before submission.

## Aggregate Errors

When presented with the potential for multiple errors (e.g. an `.errors` array from a parsing result), prefer throwing an AggregateError that encapsulates all individual errors, instead of only throwing the first one.

```ts
// bad
if (workspace.errors.length) throw workspace.errors[0];

// good
if (workspace.errors.length)
  throw new AggregateError(workspace.errors, "Failed to parse pnpm-workspace.yaml");
```

<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->
