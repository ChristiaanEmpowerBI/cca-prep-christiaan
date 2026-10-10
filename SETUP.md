# CCA-F Study Environment — Setup Guide

**Platform:** Windows 11
**Completed:** 26–29 September 2026
**Purpose:** Reproducible setup for the `cca-prep` repo and the tools needed for all six scenario builds. Written for someone with no prior Git or command-line experience.

---

## 1. What gets installed

| Tool | Why | Version installed |
|---|---|---|
| Git for Windows | Version control engine | 2.54.0 |
| GitHub account | Hosts the repo | — (2FA enabled) |
| GitHub Desktop | Visual interface for commit / push / branch | latest |
| VS Code | Editor | 1.134.0 |
| Python | Runtime for MCP servers and API scripts | 3.14.6 |
| Node.js LTS (includes npm) | Runtime for Agent SDK, CI scenario | 24.19.0 / npm 11.17.0 |
| Claude Code | AI coding tool, builds the scenarios | 2.1.142 |
| Anthropic API key | Lets scripts call Claude | set as environment variable |

Not needed for the study program: Docker, cloud accounts, a database.

---

## 2. Verify what's already installed

Open PowerShell (Windows key → type `PowerShell` → Enter) and run each line:

```
git --version
python --version
node --version
npm --version
code --version
claude --version
```

Anything that prints a version is installed. "The term 'x' is not recognized" means it's missing or not on PATH.

---

## 3. Install Node.js

**Option A — winget (fastest)**
```
winget install OpenJS.NodeJS.LTS
```
Accept the licence prompt.

**Option B — installer**
Go to nodejs.org, download the LTS Windows installer (.msi), run it, click Next with defaults. The optional "tools for native modules" box is not needed.

**Then close PowerShell and open a new one.** PATH only refreshes in a new terminal. Verify:
```
node --version
npm --version
```

npm is bundled with Node; there is nothing separate to install.

### Fix: "running scripts is disabled on this system"

If `npm --version` fails with that message, PowerShell is refusing to run any script — a Windows default. `npm` on Windows is a PowerShell script, so it's blocked. Fix once, for your user account only:

```
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Answer `Y`. This allows scripts on your own machine while still blocking unsigned downloaded ones. It's the standard developer setting.

Alternative without changing the policy: type `npm.cmd` wherever you'd type `npm`.

---

## 4. Python note

Python 3.14 is very recent. If a package refuses to install during the MCP course (Phase 4), install Python 3.12 alongside it and create the virtual environment with that version. Do nothing until it actually fails.

---

## 5. GitHub Desktop and the repo

### 5.1 Sign in
Open GitHub Desktop → Sign in to GitHub.com → approve in the browser.

### 5.2 Create the repo
File → New repository:
- Name: `cca-prep`
- Local path: a folder like `C:\Users\<you>\Projects` (create it first if needed)
- Tick **Initialize this repository with a README**
- Git ignore: None · Licence: None
- Create repository

This creates the folder on your PC with a first commit already in it.

### 5.3 Publish
Click the blue **Publish repository** button at the top. Keep "private" ticked unless you want it public. The repo now exists on github.com and is linked to the local folder.

### 5.4 Reading the top bar
The button at the top right tells you the state of the repo:

| Button | Meaning |
|---|---|
| **Publish repository** | Not on GitHub yet — click to publish |
| **Push origin** | Published; you have local commits waiting to go up |
| **Fetch origin** | Published and in sync; nothing to do |

### 5.5 Add files and folders
Repository → Show in Explorer. Inside `cca-prep` create:

```
cca-prep/
├── README.md                          (created by GitHub Desktop)
├── .gitignore                         (step 6)
├── GITHUB-AND-PIPELINE-CONCEPTS.md
├── TEAM-STUDY-PLAN.md
├── QUESTIONS.md                       (template repo only — shared question log)
├── SETUP.md                           (this file)
├── 01-support-agent/
├── 02-claude-code/
├── 03-research-agents/
├── 04-dev-productivity/
├── 05-ci-cd/
└── 06-extraction/
```

The plan files go in the root, next to README.md — not inside the scenario folders. Use these exact names; the files cross-reference each other.

Git ignores empty folders, so the six scenario folders won't appear in GitHub Desktop or on github.com until they contain a file. Drop a blank `README.md` in each if you want them visible now.

---

## 6. Create `.gitignore`

Do this in VS Code rather than Explorer — Windows hides file extensions by default, which makes naming a file `.gitignore` in Explorer error-prone.

1. In GitHub Desktop: Repository → **Open in Visual Studio Code**.
2. In VS Code's Explorer panel, hover over `CCA-PREP` at the top and click the **New File** icon. Make sure no subfolder is selected, or the file lands there.
3. Name it exactly `.gitignore` (starts with a dot, no extension) → Enter.
4. Paste:
```
.env
node_modules/
__pycache__/
.venv/
```
5. Press Enter once after the last line (avoids the harmless "no newline at end of file" warning), then Ctrl+S.

What it does: Git treats anything matching these patterns as if it doesn't exist. A `.env` file holding a key, or a huge `node_modules` folder, can never be committed by accident. Add lines over time as scenarios introduce new junk folders.

---

## 7. Commit and push

Back in GitHub Desktop, the **Changes** tab lists every new file with a tick. Clicking a file shows its diff on the right (green `+` lines are additions).

1. Bottom left, in the box labelled **Summary (required)**, type a short message, e.g. `Add study plans and gitignore`. The Description box below it is optional.
2. Click **Commit N files to main**. The snapshot now exists — on your PC only.
3. The top-right button changes to **Push origin**. Click it. The commit goes up to GitHub.
4. Refresh the repo on github.com. The files are there.
5. Click the **History** tab in GitHub Desktop to see both commits: the README one and yours.

Commit and push are deliberately separate. You can commit many times locally and push once.

---

## 8. Set the Anthropic API key

1. Get a key from console.anthropic.com → API Keys → Create Key.
2. Windows key → type `environment variables` → open **Edit environment variables for your account**.
3. Under **User variables** (top section, not System variables) click **New**.
4. Variable name: `ANTHROPIC_API_KEY` · Variable value: the key. OK → OK.
5. Open a **new** PowerShell window and run:
```
echo $env:ANTHROPIC_API_KEY
```
It should print the key.

Rules:
- The key never goes into any file in the repo. `.gitignore` blocks `.env` as a safety net, but the environment variable means you shouldn't need a `.env` at all.
- Treat it like a password: no chats, screenshots or documents. If it's ever exposed, delete it in the console, create a new one, and update the variable.

---

## 9. Checklist

- [x] Git installed and on PATH
- [x] GitHub account with 2FA
- [x] GitHub Desktop signed in
- [x] VS Code installed
- [x] Python installed
- [x] Node.js and npm installed; execution policy fixed
- [x] Claude Code installed
- [x] `cca-prep` created and published
- [x] Scenario folders and plan files in place
- [x] `.gitignore` created
- [x] First commit pushed
- [x] `ANTHROPIC_API_KEY` set and verified

---

## 10. Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `node` not recognized after install | Old terminal | Close and reopen PowerShell |
| `npm` "running scripts is disabled" | PowerShell execution policy | §3 fix, or use `npm.cmd` |
| No "Publish repository" button | Already published | Look for Push origin / Fetch origin instead |
| Scenario folders missing on GitHub | Git ignores empty folders | Add a file inside each |
| Plan files' links don't work | File names differ from the cross-references | Rename to the exact names in §5.5 |
| `$env:ANTHROPIC_API_KEY` prints nothing | Set in wrong section, or old terminal | Check it's under User variables; open a new PowerShell |
| Package install fails on Python 3.14 | Library not yet compatible | Install Python 3.12, use it for the venv |
