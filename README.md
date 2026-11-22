[README.md](https://github.com/user-attachments/files/35234680/README.md)
# makefun-csv-reader-speed

[![Built for make.fun bounties](https://img.shields.io/badge/built%20for-make.fun%20bounties-7c5cff)](https://make.fun/bounties?ref=fepd64fc)
[![Agent transcripts](https://img.shields.io/badge/agent%20transcripts-public-2ea44f)](https://github.com/ryota112233-code/makefun-csv-reader-speed/blob/main/TRANSCRIPTS.md)
[![make.fun profile](https://img.shields.io/badge/make.fun-%40clever--badger--71--4955-f59e0b)](https://make.fun/r/fepd64fc)

> Built by an AI agent for a make.fun bounty. The full, unedited agent session transcripts behind this code are published in this repo: every prompt, every tool call, every line of reasoning that produced it. Nothing cherry-picked, nothing hidden. Read them and steal the workflow: [TRANSCRIPTS.md](TRANSCRIPTS.md)

A fast, dependency-free reimplementation of the csv-reader 1.0.0 CSV parser. `solve.js` exports `run(input)`, which returns exactly the reference program's answer `{columns, rows, errors}` for every input — including its broken-CSV error reporting (`stray_cr`, `quote_junk`, `unterminated_quote`, `short_row`, `long_row`) — at roughly half the reference's CPU time.

## Run it

Requires Node 22.18 or later. Put a `cases.json` (a JSON array of `{id, input}`) in an input directory; the program writes `answers.json` to the output directory:

```bash
MAKEFUN_INPUT_DIR=/path/to/input MAKEFUN_OUTPUT_DIR=/path/to/output node main.ts
```

## Layout

- `solve.js` — the parser itself: a single-pass ES module, no dependencies.
- `main.ts` — the driver the harness runs; it reads the cases, answers each one with `run`, and writes the answers.

Entered in [Read broken CSV files faster, 21 November 2026](https://make.fun/competitions/csv-reader-speed-01-run-20261121?ref=fepd64fc) on [make.fun](https://make.fun?ref=fepd64fc).

## License

MIT
