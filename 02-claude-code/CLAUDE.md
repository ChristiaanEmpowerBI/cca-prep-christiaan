# Pricing calculator for an Elementor HTML widget

A self-contained price calculator pasted into an Elementor Pro **HTML widget** on WordPress. The visitor chooses how many service pages and location pages they need and whether each set has a parent / child hierarchy; the snippet shows an estimate.

## Layout
- `pricing/pricing.js`: pricing rules (pure functions) plus DOM wiring
- `pricing/pricing.css`, `pricing/pricing.html`: styles and markup
- `pricing/pricing.test.js`: tests
- `pricing/build.js`: inlines the CSS and JS into `pricing/dist/pricing-snippet.html`, the file that gets pasted into Elementor

## Commands
- Test: `node --test` (a bare `node --test` auto-discovers `*.test.js`; passing a directory fails on current Node)
- Build the paste-ready snippet: `node pricing/build.js`

## Standards (apply to every file)
- Money is integer cents. Never use floating-point currency in calculations; format only at display time.
- Pricing numbers live in the `RATES` object in `pricing.js` and nowhere else.
- The pasted snippet is a fragment: no `<html>`, `<head>` or `<body>`, and no external scripts, fonts or CDNs.
- JavaScript is wrapped in an IIFE and declares no globals. Query inside the widget's own root element, never by generic page-wide selectors.
- Never put dynamic values into `innerHTML`; use `textContent`.
- A change to a pricing rule needs a matching test and a matching edit to the rules document below.

## Pricing rules
@pricing/PRICING-RULES.md
