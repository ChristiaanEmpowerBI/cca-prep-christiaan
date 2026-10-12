# Pricing rules

These mirror the `RATES` object in `pricing.js`. If you change one, change the other, and update the tests.

**Confirmed:** the template price (25.00); the six templates; service-location pages; locations are one flat set (city, district and neighborhood are labels, with no drilling between them); when services are grouped into categories, every category and every service gets a page on every location; category pages are covered by the 25.00 category template and have no per-page price.
**Placeholder:** every other rate below is a guess until agreed. Anything marked *(assumed)* is also a structural guess.

## Inputs
- Number of service categories (whole number, 0-500; 0 means the services are not grouped)
- Number of service pages, the **total across all categories** (whole number, 0-500)
- Number of city pages, district pages and neighborhood pages (each a whole number, 0-500, any mix allowed, including only two of the three). The type is only a label; all location pages form one flat set.

## Page types
| Page type | How many |
|---|---|
| Service category pages | the number entered; counted in the page total, but no per-page price *(assumed counted)* |
| Service pages | the number entered (5 categories x 4 services each = 20) |
| Location pages | cities + districts + neighborhoods |
| Service-location pages (e.g. "plumber in Leeds") | (service pages + category pages) x location pages: every service and every category on every location |

Worked examples:
- 50 services + 50 cities, no categories = 50 + 50 + (50 x 50) = **2,600 pages**.
- 5 categories with 4 services each (20 services) on 10 locations: service-location pages = (5 x 10) + (20 x 10) = **250**. Total pages = 5 + 20 + 10 + 250 = **285**, from 6 templates.
- 5 cities + 30 districts + 10 neighborhoods = **45 locations** and still only 2 location templates.

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

A site with services and locations needs 5 templates, and 6 with categories. The index pages (all services, all locations) are single pages built from their templates and are **not** counted in the page total *(assumed)*.

## Rules
1. **Templates:** 25.00 each, charged once per template needed.
2. **Service pages use graduated tiers.** Each page is charged at the rate of the tier it falls in, not the whole order.
   - 1-5 at 150.00, 6-15 at 120.00, 16+ at 100.00
3. **Category pages have no per-page price.** The service category template (rule 1) is the only charge they add.
4. **Location pages are priced per type, flat, with no hierarchy.** The type is a label that sets the page price; it does not change the template count.
   - City 100.00, district 70.00, neighborhood 40.00
5. **Service-location pages use graduated tiers over the combined count**, cheaper at volume because they are templated. Category-location pages are priced the same as service-location pages *(assumed)*.
   - 1-100 at 30.00, 101-1,000 at 15.00, 1,001+ at 8.00
6. **Minimum order.** If anything is selected and the total is under 500.00, top it up to 500.00. Nothing selected means a total of 0.
7. **Money is integer cents** throughout. Format only when displaying.

Worked example prices with these rates:
- 50 services + 50 cities: templates 125.00 + services 5,450.00 + cities 5,000.00 + service-location 28,500.00 = **39,075.00**
- 5 categories, 20 services, 10 cities: templates 150.00 + services 2,450.00 + cities 1,000.00 + service-location 5,250.00 = **8,850.00**

## Open questions (not settled)
- Are category-location pages really priced like service-location pages? (Placeholder: same tiers.)
- Should the category pages themselves count in the page total? Today they do, unlike the two index pages.
- Does each service belong to exactly one category? The calculator uses totals, so it only works if a service is never counted twice.
- Can a category exist without services? Today it is accepted.
- Do cities, districts and neighborhoods really have different page prices, or is one flat location price enough?
- Are the placeholder rates sensible, especially the service-location tiers?
- Is there volume pricing for location pages, as there is for service pages?
- Is there a discount for annual or retainer terms?
