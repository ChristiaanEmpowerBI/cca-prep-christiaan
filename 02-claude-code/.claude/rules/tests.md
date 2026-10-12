---
paths:
  - "**/*.test.*"
---

# Test conventions

- Use `node:test` and `node:assert/strict`. No test dependencies.
- Name each test after the rule it checks, e.g. "adds 15% surcharge to hierarchical service pages only".
- Write expected values as literal integer cents with a comment showing the arithmetic. Never compute the expected value with the code under test.
- For any rule you add or change, cover both sides of every tier boundary, zero, and invalid input in every field.
