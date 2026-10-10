# Questions log

Anything that confused you during the program goes here, with the answer once you have it. Add entries via a pull request to this repo. This becomes the team's exam cheat sheet.

Format: date · who · the question · the answer · which domain or scenario it relates to.

| Date | Who | Question | Answer | Domain / scenario |
|---|---|---|---|---|
| 2026-09-29 | Iulian | Why does `npm --version` fail with "running scripts is disabled"? | PowerShell's default execution policy blocks scripts; `npm` is one. Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, or use `npm.cmd`. See `SETUP.md` §3. | Setup |
| 2026-09-29 | Iulian | If two branches change different parts of the same file, how does Git merge them? | Git compares each branch to the common starting commit (merge base) and applies both sets of line changes. Only when both touch the *same* lines does it stop and ask a human to resolve the conflict. See `GITHUB-AND-PIPELINE-CONCEPTS.md` §4. | Git |
| 2026-10-08 | Oz | What is the correct syntax for structured output from Claude Code in CI? The plan said `--json-schema <file>`. | The schema is passed inline as a JSON string, not a file path: `claude -p "..." --output-format json --json-schema '{"type":"object", ...}'`. The plan was wrong and has been corrected in §5 and §7. | Domain 3.6 / Scenario 5 |
| | | | | |
