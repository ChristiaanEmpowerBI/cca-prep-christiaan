# 05-ci-cd: Claude Code for CI/CD

A GitHub Actions workflow that has Claude review every pull request, post the findings as a comment, and fail the check on high-severity issues.

## How it works

```
pull_request ──► checkout ──► run-review.sh ──► format_review.py ──► gh pr comment ──► gate
                              claude -p          JSON → markdown      edits one comment   fail if any high
```

| File | Role |
|---|---|
| `.github/workflows/claude-review.yml` | The trigger and the steps. It must sit at the repo root: GitHub only runs workflows from `.github/workflows/`. |
| `CLAUDE.md` (repo root) | The review criteria: what to report, what to skip, how severity is defined. Claude Code loads it from the working directory, so the CI run sees it. |
| `05-ci-cd/review-schema.json` | The output contract passed to `--json-schema`. |
| `05-ci-cd/run-review.sh` | Builds the diff and runs `claude -p`. |
| `05-ci-cd/format_review.py` | Turns the JSON result into the PR comment and a `high_count` output for the gate. |
| `05-ci-cd/review-fixture/orders.py` | A deliberately flawed file, so the first PR has something to find. |

## Design decisions

- **`claude -p` with `--output-format json --json-schema`.** The result carries a schema-validated `structured_output` object, so CI parses fields instead of scraping prose. The schema guarantees valid syntax, not correct judgement: Claude can still be wrong about a finding.
- **Explicit criteria in CLAUDE.md.** Naming what to skip (style, naming, docstrings, speculative "might" issues) and requiring a concrete failure scenario for every finding is what cuts false positives. Vague instructions like "be conservative" do not.
- **Fresh instance, read-only tools.** `--no-session-persistence` means the reviewer has no memory of writing the code, so it is an independent review rather than self-review. `--tools "Read,Grep,Glob"` removes edit and shell access, which matters because the diff is untrusted input that could contain prompt injection.
- **Blocking check, so the synchronous API.** The PR waits for the result, so this is a normal request, not the Message Batches API. Batches are 50% cheaper but take up to 24 hours, which suits overnight jobs such as a nightly audit.
- **One edited comment.** `gh pr comment --edit-last --create-if-none` updates the same comment on every push instead of stacking new ones.
- **Cost and safety limits.** `--max-budget-usd 2` caps one run, `concurrency` cancels a superseded run, and the job is skipped for fork PRs, which never receive secrets.
- **Fail only on `high`.** Medium and low findings are advice. They appear in the comment but do not turn the check red.

## One-time setup

1. GitHub repo → Settings → Secrets and variables → Actions → New repository secret. Name `ANTHROPIC_API_KEY`, value your key.
2. Optional: Settings → Branches → require the `review` check to pass before merging. Without that, a red check does not stop the merge.

## Try it

1. Push this branch and open a PR into `main`. The review runs within about a minute.
2. Read the comment. It should report four high-severity defects in `orders.py` (hardcoded password, wrong discount, SQL injection, swallowed payment error) and nothing about the naming, unused import, long line or missing docstrings.
3. Edit `CLAUDE.md` (for example, remove the "Skip" list) and push again. Watch the comment fill up with style noise. That is the false-positive lesson.

To run it locally from a committed branch: `BASE_REF=main bash 05-ci-cd/run-review.sh && python 05-ci-cd/format_review.py`. This needs `ANTHROPIC_API_KEY` set and the Claude Code CLI installed. A run on this PR took about 40 seconds and cost roughly $0.13.

## Known limits

- **Large PRs.** The whole diff goes into one pass. For big changes the exam-recommended shape is a per-file pass for local issues plus a separate integration pass for cross-file ones, which avoids attention dilution on a single huge diff.
- **Fork PRs are skipped.** Running on them with secrets means using `pull_request_target`, which has well-known security pitfalls. Do not switch to it without reading up first.
- **The Claude Code version is pinned** (`2.1.296`) so a CLI release cannot change CI behaviour silently. Bump it deliberately.
