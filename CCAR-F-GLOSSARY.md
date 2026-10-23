# CCAR-F Exam Glossary

**Certification:** Claude Certified Architect – Foundations (CCAR-F)
**Domain weights:** Agentic Architecture 27% · Claude Code Config 20% · Prompt Engineering & Structured Output 20% · Tool Design & MCP 18% · Context Management & Reliability 15%

**Legend**
- 🔴 = will almost certainly come up. Know the definition and when to use it.
- 🟡 = likely to come up. Know what it means.
- ⚪ = just recognise it.
- **(+)** = not in the original AI-dictionary list; added from what is known about the exam guide. Check exact flags and paths against the official docs.

---

## Domain 1: Agentic Architecture & Orchestration (27%)

- 🔴 **Agentic loop**: the model calls a tool, gets the result, decides the next step, and repeats until it stops.
- 🔴 **stop_reason (+)**: `tool_use` means run the tool and continue. `end_turn` means the agent is done. `max_tokens` means the output was cut off. The loop should end on stop_reason, not on parsing the text.
- 🔴 **Coordinator / orchestrator agent**: the hub that delegates to subagents and combines their results ("hub-and-spoke").
- 🔴 **Subagent**: has its own isolated context and doesn't inherit the coordinator's history. It only knows what you put in its prompt.
- 🔴 **Context isolation (+)**: why subagents need complete, explicit briefs.
- 🔴 **Parallel subagent spawning (+)**: several Task calls in one response run at the same time.
- 🔴 **Prompt chaining / fixed sequential workflow**: use it when the steps are predictable.
- 🔴 **Dynamic decomposition (+)**: use it when the next step depends on the data.
- 🔴 **Programmatic enforcement vs prompt guidance (+)**: when compliance must be guaranteed, use code (hooks or prerequisite gates), not instructions in the prompt.
- 🔴 **Prerequisite gate (+)**: block tool B until tool A has succeeded, e.g. verify the customer before a refund.
- 🔴 **Escalation / human handoff**: clear triggers are a policy gap, the customer explicitly asking for a human, or no progress being made. Sentiment and the model's own confidence score are **not** reliable triggers.
- 🔴 **Handoff summary (+)**: a structured package for the human (customer ID, root cause, what was already tried).
- 🟡 Task decomposition, Fan-out / Fan-in, Agent routing, Router agent, Human-in-the-loop, Human-on-the-loop, Delegation, Bounded delegation
- 🟡 **Session resume / fork_session (+)**: continue a named session, or branch it to explore an alternative.
- 🟡 **Claude Agent SDK (+)**, AgentDefinition, **Task tool (+)**: the tool a coordinator uses to spawn subagents. It must be in allowedTools.
- 🟡 Agent state, Agent memory, Agent trace, Idempotency, Long-running agent
- ⚪ ReAct, Planner-Executor, Evaluator agent, Self-correction, Reflection, Guardrail (Agent), Claude Managed Agents, Background agent

## Domain 2: Tool Design & MCP Integration (18%)

- 🔴 **Tool description**: the main signal Claude uses to pick a tool. Say what the tool does, its inputs, edge cases, and when to use it instead of similar tools. Overlapping or vague descriptions lead to the wrong tool being picked.
- 🔴 **Tool schema / input_schema (+)**: the JSON Schema for a tool's parameters.
- 🔴 **tool_use / tool_result blocks (+)**: how a tool call and its answer travel in the message history.
- 🔴 **is_error (+)**, **structured error response**: error category (transient, validation, permission, business), `retryable`, and a readable message.
- 🔴 **Access failure vs empty result (+)**: "the lookup failed" is not the same as "found nothing". Never hide one as the other.
- 🔴 **Least privilege / scoped tool access**: give each agent only the tools its role needs. Too many tools makes tool choice worse (roughly 4–5 per agent is the ideal).
- 🔴 **tool_choice (+)**: `auto` lets the model decide, `any` forces some tool call, a named tool forces that tool, and `none` disables tools.
- 🔴 **MCP (Model Context Protocol)**: **tools** (actions), **resources** (read-only content and catalogues), **prompts** (templates).
- 🔴 **.mcp.json (+)**: project-level MCP servers, shared through git. User-level servers live in `~/.claude.json`. Use **env-var expansion** (`${TOKEN}`) for secrets.
- 🟡 **MCP transports (+)**: stdio for local servers, HTTP for remote ones.
- 🟡 Function calling, Tool invocation, Tool result, Retry with backoff, Rate limit, **529 Overloaded** / HTTP status codes
- 🟡 Prompt injection, **Indirect prompt injection**, Instruction hierarchy, Lethal trifecta
- 🟡 **Built-in Claude Code tools (+)**: Read, Write, Edit, Bash, Grep, Glob. Know when to use Grep (search file contents) vs Glob (find files by name pattern).
- ⚪ Computer use, API, SDK, Code mode, Tool-schema bias

## Domain 3: Claude Code Configuration & Workflows (20%)

- 🔴 **CLAUDE.md hierarchy (+)**: user level (`~/.claude/CLAUDE.md`, not shared), project level (`./CLAUDE.md` or `.claude/CLAUDE.md`, shared through git), and directory level. Also know **@imports** and `/memory`. AGENTS.md is the same idea.
- 🔴 **.claude/rules/ with path globs (+)**: conventions that load only for matching files, e.g. `**/*.test.ts`.
- 🔴 **Slash commands (+)**: `.claude/commands/` is shared with the team, `~/.claude/commands/` is personal.
- 🔴 **Skills (SKILL.md)**: frontmatter fields `description`, `allowed-tools` and `context: fork` (runs the skill in an isolated subagent). Skills load **on demand**, which is progressive disclosure.
- 🔴 **Hooks**: PreToolUse and PostToolUse. **Exit code 2 blocks the action (+)**. Hooks are deterministic, unlike instructions in a prompt.
- 🔴 **Plan mode (+)**: for large, ambiguous or multi-file changes. Direct execution is for small, clear fixes.
- 🔴 **Headless / print mode `-p` (+)**: runs Claude Code in CI. Combine with `--output-format json` and `--json-schema '<inline JSON>'` (the schema is inline, not a file path; see [QUESTIONS.md](QUESTIONS.md)).
- 🔴 **Independent review instance (+)**: a fresh session reviews code better than the session that wrote it.
- 🟡 **Subagents in `.claude/agents/` (+)**, `/compact`, `/clear` **(+)**, Explore subagent **(+)**
- 🟡 **Permission modes / `--allowedTools` (+)**, Tool permission, Sandboxing, Environment variable
- 🟡 CI/CD, Pull Request, Git, GitHub Actions script injection, Spec-driven development
- 🟡 **Iterative refinement (+)**: test-driven loops, concrete input/output examples, and an interview pattern to surface requirements.
- ⚪ Plugin, Steering file, Monorepo, Agent mode, YOLO mode, Reasoning effort, Thinking level, Ultrathink

## Domain 4: Prompt Engineering & Structured Output (20%)

- 🔴 **Explicit criteria over vague instructions (+)**: "flag only X when Y" beats "be conservative".
- 🔴 **Few-shot prompting**: the best fix for ambiguous cases and inconsistent output format. Use 2–4 targeted examples.
- 🔴 **Structured output via tool_use (+)**: force a tool call with a JSON schema. This removes *syntax* errors but **not** errors in the meaning of the output.
- 🔴 **JSON Schema design (+)**: required vs optional fields. Make fields **nullable** when the source may not contain the information, so the model doesn't invent values. Use **enums with an "other" + detail field**.
- 🔴 **Validation-retry loop (+)**: send the specific error back and retry. This only helps if the information exists in the source; retrying won't fix missing data.
- 🔴 **Message Batches API**: 50% cheaper, results within 24 h, matched by `custom_id`. Use it for non-urgent bulk work, **not** for blocking workflows or multi-turn tool loops.
- 🔴 **Multi-pass review (+)**: review each file separately, then do a pass across files. This avoids attention dilution.
- 🟡 System prompt, User / Assistant message, Prefill, Prompt template, Delimiters / XML tags
- 🟡 Chain-of-thought, Role prompting, Self-consistency, **LLM-as-a-judge**
- 🟡 **False-positive rate / precision**: a high false-positive rate destroys trust. Disable or narrow the noisy categories.
- 🟡 Hallucination, Grounding, Citation
- ⚪ Temperature, Top-p, Top-k, Stop sequence, Constrained decoding, Deterministic vs non-deterministic, Zero-shot / One-shot

## Domain 5: Context Management & Reliability (15%)

- 🔴 **Context window / tokens**: the hard limit on what fits.
- 🔴 **Lost-in-the-middle effect**: put the key facts at the **start** of the context, or at the end.
- 🔴 **"Case facts" block (+)**: keep amounts, dates and IDs in a persistent block, never only inside a summary.
- 🔴 **Progressive summarisation risk (+)**: summaries lose exact numbers and dates.
- 🔴 **Trim verbose tool output (+)**: keep only the relevant fields before results pile up in context.
- 🔴 **Context compaction / context rot**: long sessions degrade. Fix it with `/compact`, scratchpad files, or subagents that each have their own context.
- 🔴 **Provenance / claim-source mapping**: each claim keeps its source through synthesis. **Annotate conflicting sources** rather than picking one, and include dates for data that changes over time.
- 🔴 **Stratified sampling (+)**: QA even the high-confidence extractions, broken down by document type and field.
- 🔴 **Field-level confidence + calibration (+)**: send low-confidence fields to a human. Calibrate the scores on labelled data.
- 🟡 **Coverage gaps (+)**: report what *couldn't* be found, don't just leave it out.
- 🟡 Prompt caching, Conversation history, Multi-turn, Context engineering, Token budget, Observability, Eval, Golden dataset, Error analysis
- ⚪ RAG, Chunking, Embedding, Semantic search, Latency, Time to first token, Streaming, Sycophancy, Knowledge cutoff

---

## Exam patterns to drill

1. **If it must be guaranteed, use code.** Hooks and gates beat prompt instructions.
2. **Fix the root cause.** If the wrong tool gets picked, improve the tool *descriptions* before adding a classifier or a fine-tune.
3. **Subagents know nothing you didn't pass them.**
4. **Errors need structure.** Distinguish access failure from empty result and from errors worth retrying.
5. **Batches API is never for blocking or interactive work.**
6. **Escalate on policy gaps or when the customer asks.** Not on sentiment or self-reported confidence.
7. **Few-shot fixes ambiguity. A schema fixes syntax. Neither fixes meaning.**

## Safe to skip

From the AI-dictionary list, these areas aren't tested:

- **ML maths and training:** gradients, losses, optimisers, CNNs, RNNs, regularisation
- **Benchmarks:** MMLU, SWE-bench, ARC-AGI and similar
- **Hardware:** GPU, TPU, HBM
- **Regulation:** EU AI Act, FDA rules
- **Other fields:** robotics and healthcare
- **Slang:** "Clauding", "Benchmaxxing", "Workslop" and similar
- **Competitor products:** Cursor, Codex, Gemini and others
