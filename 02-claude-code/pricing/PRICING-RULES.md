# Pricing rules (PLACEHOLDER: replace with the real rules)

These mirror the `RATES` object in `pricing.js`. If you change one, change the other, and update the tests.

## Inputs
- Number of service pages (whole number, 0-500)
- Number of location pages (whole number, 0-500)
- Whether service pages have a parent / child hierarchy (yes/no)
- Whether location pages have a parent / child hierarchy (yes/no)

## Rules
1. **Graduated tiers.** Each page is charged at the rate of the tier it falls in, not the whole order.
   - Service pages: 1-5 at 150.00, 6-15 at 120.00, 16+ at 100.00
   - Location pages: 1-9 at 80.00, 10+ at 65.00
2. **Hierarchy surcharge.** If a page type is hierarchical, add 15% of that type's base price. It applies to that type only.
3. **Minimum order.** If anything is selected and the total is under 500.00, top it up to 500.00. Nothing selected means a total of 0.
4. **Money is integer cents** throughout. Format only when displaying.

## Open questions (not modelled yet)
- Is hierarchy a yes/no, or does the number of levels change the price?
- Does a service-by-location combination page (e.g. "plumber in Leeds") count as a service page, a location page, or its own type?
- Is there a discount for annual or retainer terms?
