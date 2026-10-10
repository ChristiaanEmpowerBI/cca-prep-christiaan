# GitHub, Docker, CI/CD and Claude Code — Concepts

**Purpose:** A reviewer's mental model of how code goes from an idea to a running product. Written for evaluating and discussing engineering work, not for writing code.
**Companion to:** `TEAM-STUDY-PLAN.md`

---

## 1. The chain in one line

GitHub holds the code · Docker packages it · GitHub Actions builds and ships the package · Azure runs it · the app itself calls Claude through the API or Agent SDK.

Claude Code sits in two seats: helping developers write the code, and reviewing pull requests inside CI. It is not part of the running app.

---

## 2. GitHub — the shared copy of the code

- A **repository** is a folder with its full history attached.
- A **commit** is a snapshot with a message. Nothing enters history until you commit.
- Your laptop has a copy; GitHub has a copy. **Push** sends your commits up to GitHub. **Pull** brings GitHub's commits (yours from another machine, or a teammate's) down to your laptop. Same repo, two places, kept in sync by you.
- Commit and push are separate. You can commit ten times locally; GitHub knows nothing until you push.
- Pull is how you receive other people's work. Skip it and you're working on an old copy — the source of merge conflicts.
- **Clone** = download a repo for the first time. **Fork** = copy someone else's repo into your own account.
- `git status` shows what changed; `git diff` shows exactly how. Reading diffs is the core evaluation skill.

**Is GitHub a server where you can try the app?** No. It stores and coordinates code; it doesn't run your product. Two partial exceptions:

- **GitHub Actions** runs short jobs on temporary machines when something happens (a push, a pull request). Automation, not hosting.
- **GitHub Pages** can host a static site straight from a repo. Fine for docs, not for an app with a backend.

---

## 3. Branches

A **branch** is a parallel copy of the code you can change without touching the version everyone else relies on.

- The main line is usually called `main` — "the app as it currently is."
- To start new work, create a branch from `main` (e.g. `feature/forecast-screen`). It's identical at that moment; from then on, commits go to the branch only and `main` doesn't move.
- **Why:** isolation (break things freely), parallel work (two developers, two branches), a unit of review (the branch *is* "everything needed for the forecast screen"), disposability (bad idea → delete the branch).
- **Naming:** `feature/…`, `fix/…`, `hotfix/…`.
- **Keep them short-lived** — days, not weeks. The longer a branch lives, the further `main` drifts and the harder the merge.
- Some teams use a `develop` branch between features and `main`: test deploys come from `develop`, production from `main`.

Mechanics:
```
git checkout main
git pull
git checkout -b feature/forecast-screen
```
Or in GitHub Desktop: Branch → New branch.

Data analogy: building a new report in a development project rather than editing the production MicroStrategy project directly.

---

## 4. Merging — how two branches combine

Git compares each branch to the point they both started from (the **merge base**), not to each other. For every file it has three versions: original, branch A's, branch B's. It works out per line what each branch changed.

- **Different lines changed** (A fixed lines 40–45 of `calculations.py`; B added a new file and 30 lines to `routes.py`) → Git applies both automatically. Line-range arithmetic, no judgement needed.
- **Same lines changed** → a **conflict**. Git stops and marks the region:

```
<<<<<<< main
    return round(total, 2)
=======
    return round(total, 2), forecast
>>>>>>> feature/forecast-screen
```

A human edits it into the correct combined version and commits. Claude Code can propose the resolution; a person confirms.

**Typical sequence:** A merges first. B pulls the updated `main` into their branch (Git applies A's fix onto B's work), CI re-runs on the combined code, then B merges. GitHub's PR page says "can be merged automatically" or "has conflicts."

**The subtle case:** the merge succeeds with no conflict but the result is wrong — A renamed a function, B added a call under the old name in a different file. Git is happy; the app breaks. That's what CI tests are for.

Data analogy: two people editing different columns → fine. Same cell → someone decides. A foreign key silently broken by a rename → the "merges cleanly but fails" case, caught only by validation after the load.

---

## 5. Pull requests

A **pull request (PR)** is "please review this branch and merge it into `main`." It's where code review lives:

- Shows the full diff of the branch against `main`.
- Triggers CI automatically.
- Collects reviewer comments (human and, if configured, Claude Code's).
- Has a Merge button, often gated on green CI and at least one approval.

---

## 6. Running the app — servers, containers, deployment

Three stages; you need each only when you reach it.

**Stage 0 — plain scripts.** The exam scenarios. `python agent.py` or `node agent.js` from the terminal. No server. (An "MCP server" is just a Python file Claude Code starts and talks to over stdin/stdout — "server" means "the side that answers," not "a machine.")

**Stage 1 — local dev server (a command, not an install).** A real app has a front end and a backend; both must be running to click through it. Typically `npm run dev` plus `python app.py`, then open `localhost:3000`. Database is often just a file (SQLite) at this stage.

**Stage 2 — container (Docker).** Packages the app plus its exact dependencies so it runs identically on every laptop and every server. Fixes "works on my machine." The repo carries a `Dockerfile` and usually `docker-compose.yml`; `docker compose up` starts app, backend and database together. Optional for a solo prototype; near-mandatory once two developers or a client are involved. The same container that runs locally is what runs in production — it's the packaging format, not just a local tool.

**Stage 3 — deployment.** The container runs somewhere always-on: Azure (Container Apps, App Service, AKS for bigger setups), AWS, GCP, or simpler hosts. You push the container image to a registry; the cloud service pulls and runs it. Database and API keys move into managed cloud services. This is where dev/test/prod environments exist and where costs start.

Useful even for a reviewer: install Docker Desktop so you can run `docker compose up` on a teammate's branch and see their version of the app.

---

## 7. CI/CD

**Continuous Integration / Continuous Delivery (or Deployment)** — the automated pipeline that runs on every push.

- **CI:** every push or PR triggers checks — does it build, do tests pass, style rules, security scan, Claude Code review. Problems surface in minutes. "Integration" = merging everyone's work into `main` continuously instead of one big-bang at the end.
- **CD:** if CI passes, package the app (the container) and push it out. *Delivery* = ready, a human presses the button. *Deployment* = goes live automatically. Most teams: automatic to test, manual approval for production.
- **Engine:** GitHub Actions. Push to `main` → tests → build container → push to Azure → Azure runs the new version. Minutes, no humans.
- **Why it matters when evaluating a team:** it's the difference between "the developer says it works" and "the system proved it works." "Do you have CI, and what does it check?" is one of the fastest signals of engineering maturity.

Data analogy: the scheduled, automated validation run — nothing lands in the warehouse until the checks pass — but for code.

---

## 8. Where Claude Code fits

1. **Developer's seat.** In a terminal, in the repo: "add a category filter," "why is this test failing." Claude Code reads the codebase, edits files, runs tests, commits — developer reviews and steers. `CLAUDE.md` in the repo carries the project rules and is shared through GitHub.
2. **Automated reviewer's seat.** Run non-interactively (`claude -p`) inside GitHub Actions: reviews the PR diff against `CLAUDE.md`, posts comments or a structured verdict before a human looks. This is exam Scenario 5.

**Not** in the running app. The product calls Claude through the API or Agent SDK. Same model, different seats.

---

## 9. Practical scenario — adding a screen to the budgeting app

| Step | Who | What |
|---|---|---|
| 1 Branch | Developer | `feature/forecast-screen` off `main` |
| 2 Build | Developer + Claude Code | Screen, endpoint, tests; commits on the branch |
| 3 Try locally | Developer | `docker compose up`, `localhost:3000` |
| 4 Push, open PR | Developer | Code goes to GitHub; pipeline wakes up |
| 5 CI runs | Pipeline | Tests, build container, Claude Code review. Red → fix and push again |
| 6 Deploy to test | Pipeline | Container running on Azure test environment, e.g. `budget-test.yourcompany.com` |
| 7 Review | **You** | Open the test link, click through, approve or send back |
| 8 Merge | Reviewer + you | Second engineer reviews; Merge joins the branch to `main` |
| 9 Deploy to prod | Pipeline | Build, push to registry, approval gate, live |
| If it breaks | Pipeline | Roll back to the previous container image (one click); fix on a new branch |

Your role is steps 7 and 8. A small screen typically takes a day or two, mostly waiting on review.

---

## 10. Vocabulary quick reference

| Term | Meaning |
|---|---|
| Repository (repo) | Folder + full history |
| Commit | Saved snapshot with a message |
| Push / Pull | Send commits up to GitHub / bring commits down from GitHub |
| Clone / Fork | First download of a repo / copy of someone else's repo into your account |
| Branch | Parallel line of commits |
| `main` | The primary branch; usually what production runs |
| Merge | Combine a branch into another |
| Merge base | The commit where two branches split; what Git compares against |
| Conflict | Same lines changed on both sides; human resolves |
| Pull request (PR) | Request to review and merge a branch |
| Diff | Line-by-line view of what changed |
| CI / CD | Automated checks on every push / automated packaging and release |
| GitHub Actions | GitHub's CI/CD engine |
| Container | Packaged app + dependencies (Docker) |
| Image | A built, versioned container ready to run |
| Registry | Where container images are stored (e.g. Azure Container Registry) |
| localhost | Your own machine, as seen by your browser |
| Dev / test / prod | Environments: developer's laptop / shared trial / live for customers |
| Rollback | Redeploy the previous image |
| MCP server | A small program Claude Code starts and queries; not a machine |
