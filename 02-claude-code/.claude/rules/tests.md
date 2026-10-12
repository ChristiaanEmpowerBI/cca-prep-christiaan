---
paths:
  - "**/*.test.*"
---

# Test conventions

- Use `node:test` and `node:assert/strict`. No test dependencies.
- Name each test after the rule it checks, e.g. "adds 15% surcharge to hierarchical service pages only".
- Write expected values as literal integer cents with a comment showing the arithmetic. Never compute the expected value with the code under test.
- Cover the edges of every tier (5/6, 15/16, 9/10), zero, and invalid input for any rule you add or change.
