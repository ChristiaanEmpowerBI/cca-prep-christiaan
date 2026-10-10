# CCA-F Team Study Plan — Developers & Forward-Deployed Engineers

**Certification:** Claude Certified Architect – Foundations (CCAR-F)
**Audience:** Data / BI engineers (ETL, DW, MicroStrategy, SQL) moving into building with Claude
**Created:** 26 September 2026
**Start date:** Wednesday 30 September 2026
**Exam window:** Wednesday 28 – Friday 30 October 2026, or earlier if you feel ready. Iulian pays and books each person's slot right after the 30 September kickoff — create your Pearson VUE account before then. 24-hour cancellation rule.
**Cost:** exam fee and any retake paid by the company
**Companion documents:** `SETUP.md` (environment and repo setup, step by step), `GITHUB-AND-PIPELINE-CONCEPTS.md` (branches, merging, CI/CD, containers), `QUESTIONS.md` (shared question log).

---

## 1. What's different from the review-only plan

| | Review-only plan | Engineer plan |
|---|---|---|
| Courses | All, watched | All, **with every exercise completed** |
| Scenario builds | Claude Code builds, reviewer questions | **Hand-built first**, then compared with a Claude Code build |
| Agent SDK | Concept walkthrough | Full build day with the SDK |
| GitHub | Taught from scratch | Taught in onboarding; skipped by those who already know it |
| Exit test | Can evaluate and sell the design | Can evaluate, **build, debug, and hand over** the design |
| Stretch goal | — | Claude Certified Developer – Foundations (CCDV-F) |

Same exam, same pass mark. The engineer version simply removes the "someone else builds it" shortcut.

---

## 2. One plan, one pace

Everyone follows the same 4-week plan at **20 hours per week** — fixed slots, e.g. two hours every weekday evening plus a Saturday morning. "Twenty hours this week" without fixed slots tends to become eight; the weekly demo sync is what keeps it honest.

Total: **~80 hours** for someone starting from SQL only.

**If you already know a topic, skip it.** The onboarding block (§3) is 15 hours; engineers who worked on the Lagardère budgeting app repo can skip Git & GitHub, code literacy and Claude Code 101 and save all 15, finishing in about 3.5 weeks. Anyone comfortable with a course topic can move through it faster — the hours below are for someone seeing it for the first time.

Courses are **read for understanding, not completed exercise by exercise**, unless a topic is new to you. The exercises that matter are the six scenario builds.

Pair up: someone who skipped the onboarding block with someone who did it. The pair works through the scenario builds together.

## 3. Hour estimates

Course durations are estimates from the Skilljar catalog; "with exercises" roughly doubles video time.

### Onboarding (skip what you already know)

| Block | Hours | Content |
|---|---|---|
| Code literacy (not Python) | 4 | Reading, not writing: what a function, dict and list look like; how JSON maps to them; `async`/`await` at a glance; what a virtual environment and `pip install` do. Taught interactively by Claude Code on the actual scenario files. The exam tests reading a snippet and spotting what's wrong; Claude Code writes the code. |
| Git & GitHub | 8 | GitHub Skills "Introduction to GitHub" (1h), then the six operations three times: GitHub Desktop, then terminal. Branch → PR → merge on a practice repo. Follow `SETUP.md`. |
| Claude Code 101 | 3 | Before anything else so Claude Code becomes the tutor for the rest. |
| **Subtotal** | **15** | |

### Core program

Hours assume the topic is new to you. Do an exercise only when the topic is unfamiliar; move faster where it isn't. Scenario builds are where the time goes.

| Phase | Item | Hours | Notes |
|---|---|---|---|
| 1 | AI Fluency + AI Capabilities and Limitations + Claude 101 | 3 | Foundations; move quickly if familiar |
| 2 | Claude Code 101 | 2 | Done in onboarding |
| 2 | Claude Code in Action | 3 | |
| 2 | Introduction to agent skills + Introduction to subagents | 2 | |
| 2 | **Scenario 2 build** — Claude Code configuration | 3 | Claude Code builds; engineer reviews, diffs, questions |
| 2 | **Scenario 5 build** — CI/CD | 4 | Claude Code builds the workflow; engineer opens a real PR and reads the review |
| 3 | Building with the Claude API | 7 | The one to spend most time on; do the tool-use and structured-output exercises |
| 3 | Claude Platform 101 | 2 | Focus on the agent-loop module |
| 3 | **Scenario 6 build** — structured extraction | 5 | Hand-built |
| 4 | Introduction to Model Context Protocol | 5 | Build the course's server |
| 4 | Model Context Protocol: Advanced Topics | 2 | Overview only |
| 4 | **Scenario 4 build** — MCP server + Claude Code | 5 | Hand-built |
| 5 | Agent SDK docs + first agent | 4 | docs.claude.com; not covered by any course |
| 5 | **Scenario 1 build** — support agent | 6 | Hand-built, then break it deliberately |
| 5 | **Scenario 3 build** — multi-agent research | 6 | Hand-built, then break it deliberately |
| 6 | Task-statement checklist against repo | 2 | |
| 6 | Sample questions + distractor analysis | 2 | |
| 6 | Syntax drill (flags, paths, config keys) | 2 | See §7 |
| 6 | Exam | 2 | |
| | **Subtotal** | **~67** | |

Onboarding 15 + core ~65 (Claude Code 101 counted once) → **~80 hours, 4 weeks**. Skipping onboarding → ~65 hours, about 3.5 weeks.

### Optional

| Item | Hours | Who |
|---|---|---|
| Claude with Amazon Bedrock / Claude on Google Cloud | 4 each | Only if the client runs on that platform; out of exam scope |
| Claude Certified Developer – Foundations prep | 20–30 | FDEs after passing Architect; covers evaluation, testing, security, model selection |

---

## 4. Calendar (20 hours/week, 4 weeks)

Individual days are ±1. Cloud courses are excluded. Anyone skipping the onboarding block starts Week 1 at "Phase 1" and finishes a few days early; they may book the exam for Monday 26 or Tuesday 27 October instead.

| Week | Focus | Deliverable |
|---|---|---|
| 1 — Wed 30 Sep to Tue 6 Oct (kickoff Wed 13:00) | Onboarding: `SETUP.md`, Git & GitHub block, code literacy with Claude Code, Claude Code 101. Phase 1 (AI Fluency, AI Capabilities and Limitations, Claude 101). Start Claude Code in Action. | Repo with a merged PR; environment verified |
| 2 — Wed 7 to Tue 13 Oct | Finish Claude Code in Action, agent skills, subagents, **Scenario 2**, **Scenario 5**, start Building with the Claude API | `02-claude-code` committed; PR reviewed by Claude in CI |
| 3 — Wed 14 to Tue 20 Oct | Finish Building with the Claude API, Platform 101, **Scenario 6**, Intro to MCP, **Scenario 4** | Extraction pipeline; MCP server in `.mcp.json` |
| 4 — Wed 21 to Tue 27 Oct | MCP Advanced (overview), Agent SDK, **Scenario 1**, **Scenario 3**, consolidation (Sun 25 to Tue 27) | Support agent with hooks; coordinator + subagents |
| **Wed 28 – Fri 30 Oct** | **Exam** | Pass |

Those who finish early spend the spare days mentoring their pair through Scenarios 1 and 3 — teaching it is the best final review there is.

---

## 5. Scenario builds

Each build lives in its own folder and ends with a commit. Build order follows the calendar: 2, 5, 6, 4, 1, 3.

### Scenario 2 — Code Generation with Claude Code (folder `02-claude-code`)

Take a small sample project and set up:
- Project-level `CLAUDE.md` with universal standards
- A `.claude/rules/` file with YAML frontmatter `paths:` glob (e.g. `**/*.test.*`)
- A project slash command in `.claude/commands/`
- A skill in `.claude/skills/` with `context: fork` and `allowed-tools`
- Run `/memory` to verify what loads
- One task in plan mode, one in direct execution — compare

Concepts tested: config hierarchy (user / project / directory), `@import`, `.claude/rules/` vs subdirectory CLAUDE.md, skills vs CLAUDE.md, plan mode criteria, Explore subagent.

### Scenario 5 — Claude Code for CI/CD (folder `05-ci-cd`)

- A GitHub Actions workflow that runs `claude -p` with `--output-format json --json-schema '<schema>'` on a pull request
- Review criteria in CLAUDE.md (what to report vs skip)
- Open a PR on a branch; read the review Claude posts

Concepts tested: `-p`/`--print`, structured CI output, explicit criteria to cut false positives, independent review instance vs self-review, per-file + integration review passes, sync API for blocking checks vs Batches API for overnight jobs.

### Scenario 6 — Structured Data Extraction (folder `06-extraction`)

- An extraction tool with a JSON schema: required + optional/nullable fields, enum with `"other"` + detail string, `"unclear"` for ambiguous cases
- `tool_choice: "any"` and forced tool selection `{"type": "tool", "name": "..."}`
- Pydantic validation → retry with the error appended to the prompt
- Few-shot examples for varied document formats
- A small Message Batches job with `custom_id`; resubmit only failures
- Field-level confidence scores; route low-confidence to human review

Concepts tested: tool_use eliminates syntax errors but not semantic ones; nullable fields prevent fabrication; when retries can't help (info absent from source); batch API tradeoffs (50% cheaper, up to 24h, no multi-turn tools).

### Scenario 4 — Developer Productivity with Claude (folder `04-dev-productivity`)

- A small MCP server with 3–4 tools, two deliberately similar, differentiated only by description
- Structured errors: `isError`, `errorCategory` (transient / validation / permission / business), `isRetryable`
- One MCP resource exposing a content catalog
- Project-scoped `.mcp.json` with `${VAR}` expansion; a second server in user-scoped `~/.claude.json`
- Use Claude Code with Grep / Glob / Read / Edit plus the server to explore an unfamiliar repo

Concepts tested: tool descriptions as the primary selection mechanism; splitting vs consolidating tools; too many tools degrades selection; Grep (content) vs Glob (paths); Edit → Read+Write fallback; community servers over custom for standard integrations.

### Scenario 1 — Customer Support Resolution Agent (folder `01-support-agent`)

- Four mock tools: `get_customer`, `lookup_order`, `process_refund`, `escalate_to_human`
- A hand-written agentic loop on `stop_reason`
- A hook that blocks refunds over $500 and redirects to escalation
- A programmatic gate that blocks `process_refund` until `get_customer` returned a verified ID
- Explicit escalation criteria with few-shot examples in the system prompt
- A "case facts" block (amounts, dates, order IDs) kept outside summarised history
- Structured handoff summary for human escalation

Concepts tested: hooks for deterministic guarantees vs prompts for probabilistic compliance; escalation triggers (explicit customer request, policy gaps, no progress); sentiment and self-confidence are unreliable proxies; ask for identifiers on multiple matches; trim verbose tool output.

### Scenario 3 — Multi-Agent Research System (folder `03-research-agents`)

- Coordinator with `allowedTools` including `"Task"`, plus at least two subagents
- Parallel Task calls in a single coordinator response
- Subagent outputs as structured claim / evidence / source / date
- Simulated subagent timeout returning structured error context (failure type, attempted query, partial results, alternatives)
- Test with two credible sources giving conflicting numbers — output must keep both with attribution

Concepts tested: hub-and-spoke; isolated subagent context; narrow decomposition as root cause of coverage gaps; scoped cross-role tools (e.g. `verify_fact` for synthesis); provenance through synthesis; lost-in-the-middle; scratchpad files; crash-recovery manifests; `/compact`.

### How to work each build

- **Scenarios 2 and 5** (Claude Code configuration, CI/CD): Claude Code builds them; the engineer reviews the diff, asks why each file is where it is, and opens the real PR. They're configuration, not code.
- **Scenarios 6, 4, 1, 3: build by hand first.** Then ask Claude Code to build the same thing and diff the two. Where Claude's version differs, work out which is better and why. That comparison is the most exam-relevant hour in each build.
- **Break it deliberately** on Scenarios 1 and 3. Introduce one of the exam's anti-patterns (minimal tool descriptions, prompt-only enforcement, generic error strings, too many tools on one agent), observe the failure, fix it. You'll recognise the distractors on sight.
- **Write a one-page handover** per scenario: what it does, key design decisions, what a client would need to run it. FDEs do this for real; everyone benefits from the discipline.
- **Commit at each milestone**, not at the end. Reviewers (and future you) need the diff history.

### Mapping to what the team already knows

| Data / BI concept | Claude equivalent | Where it appears |
|---|---|---|
| ETL pipeline with fixed stages | Prompt chaining / fixed sequential workflow | Domain 1.6 |
| Orchestrator (Airflow DAG, MSTR schedule) | Coordinator agent | Domain 1.2 |
| Task that decides its next step from data | Dynamic decomposition / agentic loop | Domain 1.1, 1.6 |
| DW schema, NOT NULL vs nullable | JSON schema, required vs optional fields | Domain 4.3 |
| Data quality checks + reprocessing | Validation-retry loop | Domain 4.4 |
| Nightly batch load vs real-time query | Message Batches API vs synchronous API | Domain 4.5 |
| MSTR metric definitions and descriptions | Tool descriptions (what it does, when to use it) | Domain 2.1 |
| Error codes in a load log | Structured error responses (`isError`, category, retryable) | Domain 2.2 |
| Row-level security / role-based access | Scoped tool access per agent | Domain 2.3 |
| Lineage / source-to-target mapping | Claim-source provenance through synthesis | Domain 5.6 |
| Sampling for QA sign-off | Stratified sampling of high-confidence extractions | Domain 5.5 |
| Staging tables to keep facts intact | "Case facts" block outside summarised history | Domain 5.1 |

Use these when explaining concepts to colleagues coming from SQL only — the patterns are familiar; only the vocabulary is new.

---

## 6. Team mechanics

- **One repo per person**, created from https://github.com/EmpowerBI/cca-prep-template (click "Use this template", create it under the EmpowerBI organisation). Name it `cca-prep-<yourname>`. Your six scenario builds live there; nobody else's commits get in your way.
- **Weekly 45-minute sync, every Thursday.** Each pair demos one scenario or one broken-then-fixed anti-pattern. Rotate who presents.
- **Shared question log**: `QUESTIONS.md` in the template repo. Anything that confused you goes in with the answer once found — add it via a pull request, which is itself PR practice. `main` is protected, so a PR is the only way in. It becomes the team's exam cheat sheet.
- **Exam booking:** done centrally right after the kickoff — bring your preferred day in the 28–30 October window (or earlier if you feel ready). Create your Pearson VUE account beforehand. The company pays the fee, and the retake if needed. 24-hour cancellation rule if plans change.
- **Stagger exam dates** so the first passer can brief the others on what the scenarios felt like (without disclosing content — NDA applies).

---

## 7. Syntax drill — memorise explicitly

Developers lose points here more often than on architecture. Twenty minutes a day in the final week.

| Item | Answer |
|---|---|
| Non-interactive Claude Code | `claude -p` / `--print` |
| Structured CI output | `--output-format json --json-schema '<schema as JSON text>'` — the schema is passed inline as a string, not a file path |
| Project slash commands | `.claude/commands/` (shared via git) |
| Personal slash commands | `~/.claude/commands/` |
| Skills location and frontmatter | `.claude/skills/<name>/SKILL.md`; `context: fork`, `allowed-tools`, `argument-hint` |
| Path-scoped rules | `.claude/rules/*.md` with YAML `paths: ["glob"]` |
| CLAUDE.md hierarchy | `~/.claude/CLAUDE.md` (user) → project root or `.claude/CLAUDE.md` → subdirectory |
| Check what's loaded | `/memory` |
| Reduce context | `/compact` |
| Resume a named session | `--resume <session-name>` |
| Branch a session | `fork_session` |
| Project MCP servers | `.mcp.json` with `${ENV_VAR}` expansion |
| Personal MCP servers | `~/.claude.json` |
| Coordinator can spawn subagents | `allowedTools` includes `"Task"` |
| Loop continues / stops | `stop_reason == "tool_use"` / `"end_turn"` |
| Force a tool | `tool_choice: {"type": "tool", "name": "..."}` |
| Must call some tool | `tool_choice: "any"` |
| Batch API | 50% cheaper, ≤24h, `custom_id`, no multi-turn tool calls |
| MCP failure flag | `isError: true` |
| Content search vs path search | Grep vs Glob |
| Edit fails on non-unique match | Read + Write |

---

## 8. Exam facts (for reference)

60 items · 4 of 6 scenarios · 120 min · Pearson VUE, proctored · 720/1000 scaled passing score · $125 · valid 12 months (free renewal if on time) · retake waits 14/30/90 days, max 4 per year.

Domain weights: Agentic Architecture 27% · Claude Code Config 20% · Prompt Engineering & Structured Output 20% · Tool Design & MCP 18% · Context Management & Reliability 15%.

---

## 9. Progress tracker

| Name | Onboarding skipped? | Current week | Scenarios done (of 6) | Exam date | Result |
|---|---|---|---|---|---|
| Lourens | | | | | |
| Anton | | | | | |
| Pavel | | | | | |
| Andy | | | | | |
| Gabi | | | | | |
| Christiaan | | | | | |
| Oz | | | | | |
