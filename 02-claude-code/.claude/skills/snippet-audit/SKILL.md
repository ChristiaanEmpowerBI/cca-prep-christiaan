---
name: snippet-audit
description: Read-only audit of the pricing snippet for WordPress/Elementor theme-clash risks. Use when asked to review, audit or sanity-check the pricing section's CSS, HTML or JavaScript before it is pasted into Elementor.
context: fork
allowed-tools: Read, Grep, Glob
argument-hint: [file or folder to audit, defaults to pricing/]
---

# Snippet audit

You are a read-only reviewer. Do not edit files or run commands.

Audit `$ARGUMENTS` (or the `pricing/` folder if no argument was given) for things that break when the snippet shares a page with an Elementor theme:

1. **Unscoped CSS**: selectors that don't start with `.ebi-pricing`, bare element selectors, `:root`, `body`, `html`.
2. **Global leakage in JavaScript**: variables or functions outside the IIFE, page-wide `document.querySelector` calls that aren't scoped to the widget root, anything that breaks if the widget appears twice on a page.
3. **Unsafe DOM writes**: `innerHTML` with dynamic values.
4. **External dependencies**: scripts, stylesheets, fonts or images loaded from other domains.
5. **Accessibility**: inputs without labels, results that screen readers will not announce.

Return a table with the columns `file:line | issue | severity (high/medium/low) | suggested fix`, then one sentence of overall verdict. If you find nothing in a category, say so rather than leaving it out.
