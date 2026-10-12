# Pricing rules

These mirror the `RATES` object in `pricing.js`. If you change one, change the other, and update the tests.

**Confirmed:** templates cost 25.00 each, and there are six of them; service category, service, city and neighborhood pages cost 5.00 per page; service-location pages are graduated (5.00 for the first 500, 4.00 for pages 501-1,000, 3.00 from page 1,001); four standard pages (home, about us, privacy policy, contact us) cost 25.00 each; projects smaller than 500.00 are not taken on; locations are one flat set (city, district and neighborhood are labels, with no drilling between them); when services are grouped into categories, every category and every service gets a page on every location.
**Assumed:** anything marked *(assumed)* below.

## Inputs
- Number of service categories (whole number, 0-500; 0 means the services are not grouped)
- Number of service pages, the **total across all categories** (whole number, 0-500)
- Number of city pages, district pages and neighborhood pages (each a whole number, 0-500, any mix allowed, including only two of the three). The type is only a label; all location pages form one flat set.

## Page types
| Page type | How many | Price per page |
|---|---|---|
| Service category pages | the number entered | 5.00 |
| Service pages | the number entered (5 categories x 4 services each = 20) | 5.00 |
| City pages | the number entered | 5.00 |
| District pages | the number entered | 5.00 *(assumed: no rate was given)* |
| Neighborhood pages | the number entered | 5.00 |
| Service-location pages (e.g. "plumber in Leeds") | (service pages + category pages) x location pages: every service and every category on every location | graduated: 5.00 for the first 500, 4.00 for 501-1,000, 3.00 from 1,001 |
| Standard pages: home, about us, privacy policy, contact us | always 4 | 25.00 each |

The standard pages are included in **every order** *(assumed)*. They are priced individually, so they are not built from the templates below, add no templates, and are not part of the page total.

## Templates (one-off, 25.00 each)
A template is the design/build work for one kind of page.

| Template | When it is needed |
|---|---|
| All services | any service pages |
| Per service | any service pages |
| Service category | any service categories |
| All locations | any location pages |
| Per location | any location pages: one template for every location, whatever its type |
| Service-location | services or categories together with locations; one template covers both the category-location and the service-location pages |

A site with services and locations needs 5 templates, and 6 with categories. The index pages (all services, all locations) are single pages built from their templates; they are not counted in the page total and have no price of their own *(assumed)*.

## Rules
1. **Templates:** 25.00 each, charged once per template needed.
2. **Pages:** 5.00 each for service category, service, city, district and neighborhood pages.
3. **Service-location pages use graduated tiers.** Each page is charged at the rate of the tier it falls in, not the whole order: 5.00 for pages 1-500, 4.00 for pages 501-1,000, 3.00 from page 1,001. For 1,500 pages: (500 x 5.00) + (500 x 4.00) + (500 x 3.00) = 6,000.00.
4. **Standard pages:** 4 x 25.00 = 100.00, in every order.
5. **Total** = templates + standard pages + pages + service-location pages.
6. **Minimum project size: 500.00.** We do not take on projects smaller than this. The price is **not** topped up: the calculator still shows the calculated total and adds the notice "Although the estimated price is 280.00, we do not take on projects smaller than 500.00." (with the real figure). A total of exactly 500.00 is accepted.
7. **Money is integer cents** throughout. Format only when displaying.

## Worked examples
| Order | Pages | Templates | Total |
|---|---|---|---|
| 3 categories, 10 services, 2 cities, 10 neighborhoods | 3 + 10 + 12 + 156 = 181 | 6 | 150.00 + 100.00 + 905.00 = **1,155.00** |
| 5 categories, 20 services (4 each), 10 cities | 5 + 20 + 10 + 250 = 285 | 6 | 150.00 + 100.00 + 1,425.00 = **1,675.00** |
| 50 services, 50 cities | 50 + 50 + 2,500 = 2,600 | 5 | 125.00 + 100.00 + 250.00 + 250.00 + 9,000.00 = **9,725.00** (service-location: 2,500 + 2,000 + 4,500) |
| 30 services, 50 cities | 30 + 50 + 1,500 = 1,580 | 5 | 125.00 + 100.00 + 150.00 + 250.00 + 6,000.00 = **6,625.00** |
| 5 cities, 30 districts, 10 neighborhoods | 45 | 2 | 50.00 + 100.00 + 225.00 = **375.00** |
| 2 services, 3 cities | 2 + 3 + 6 = 11 | 5 | 125.00 + 100.00 + 55.00 = **280.00**, below the minimum, so the notice is shown |
| Nothing selected | 0 | 0 | 100.00 (the four standard pages), below the minimum |

## Open questions (not settled)
- Are the four standard pages always included, or optional (for example, a client who already has a privacy policy)?
- Do district pages cost 5.00 like the others?
- The service-location tiers count category-location and service-location pages together. Is that right?
- Do the other page types (services, categories, cities, districts, neighborhoods) get volume tiers too? Today they are a flat 5.00.
- Should the notice say how much more a visitor needs to add to reach 500.00? Today it only states the minimum.
- Does each service belong to exactly one category? The calculator uses totals, so it only works if a service is never counted twice.
- Can a category exist without services? Today it is accepted.
- Is there a discount for annual or retainer terms?
