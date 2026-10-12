---
description: Run the tests, build the Elementor snippet, and check it is safe to paste
argument-hint: [optional extra focus, e.g. "accessibility"]
allowed-tools: Bash(node --test), Bash(node pricing/build.js), Read, Grep
---

Check that the pricing snippet is ready to paste into an Elementor HTML widget.

1. Run `node --test`. If anything fails, stop and report the failures.
2. Run `node pricing/build.js`.
3. Search the built file `pricing/dist/pricing-snippet.html` for each of these, which must all be absent:
   - `<html`, `<head`, `<body`
   - `src="http` or `href="http` (external resources)
   - `innerHTML`
4. Report one line per check: PASS or FAIL, with the line number for any FAIL.

Extra focus requested by the user: $ARGUMENTS
