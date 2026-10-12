---
paths:
  - "**/*.css"
---

# CSS for the Elementor snippet

The theme and Elementor load their own CSS on the same page. Anything unscoped leaks out and restyles the rest of the site.

- Every selector starts with `.ebi-pricing`. Name children BEM-style: `.ebi-pricing__row--total`.
- No bare element selectors (`h3 {}`, `input {}`), and no `html`, `body` or `:root` selectors.
- Define colours, spacing and radii as custom properties on `.ebi-pricing`, not on `:root`.
- Inherit `font-family` from the theme. Don't load fonts or use `@import`.
- Avoid `!important`. If Elementor forces it, add a comment saying which Elementor rule you are beating.
