# Entry workspace: make.fun CSV reader speed bounty

This repository is an entry for the make.fun coding bounty
"Read broken CSV files faster, 21 November 2026"
(slug: csv-reader-speed-01-run-20261121).

## What this repository must contain

- `solve.js` — a dependency-free ES module exporting `run(input)`. For every
  input it must return exactly the same value as the reference program
  csv-reader 1.0.0 returns: the object `{columns, rows, errors}`.
- `main.ts` — the driver the harness runs with Node 22: it reads every case
  from `cases.json` in the input directory (`MAKEFUN_INPUT_DIR` or `/input`),
  answers each case with `run`, and writes `answers.json` to the output
  directory (`MAKEFUN_OUTPUT_DIR` or `/output`).
- `package.json` with `{"type": "module"}`.
- `README.md` and `LICENSE` are added at packaging time, not during the build.

## Rules for work in this repository

- Write all code yourself in this workspace. Do not copy the reference
  implementation's code into `solve.js`; reimplement its documented behavior
  in your own faster code. Reading the reference to learn the exact behavior
  is expected.
- No dependencies, no installs, no WebAssembly, no native addons. Plain
  JavaScript for `solve.js`; `main.ts` may use only erasable TypeScript
  syntax (Node runs it directly, with no build step).
- The result must be deterministic and identical on every run. Do not cache
  anything from one case to the next: each case is answered alone.
- Verify before you finish: the practice set must match the reference
  answers exactly on every case, and the entry must be faster than the
  reference on the same machine.
