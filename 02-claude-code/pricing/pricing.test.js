'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tieredTotal, calculatePrice, RATES } = require('./pricing.js');

const none = { servicePages: 0, categoryPages: 0, cities: 0, districts: 0, neighborhoods: 0 };

test('tiered total is zero for zero pages', () => {
  assert.equal(tieredTotal(0, RATES.services), 0);
});

test('service tier edge: 5 pages all at the first-tier rate', () => {
  // 5 * 15000
  assert.equal(tieredTotal(5, RATES.services), 75000);
});

test('service tier edge: page 6 is charged at the second-tier rate', () => {
  // 5 * 15000 + 1 * 12000
  assert.equal(tieredTotal(6, RATES.services), 87000);
});

test('service tier edge: page 16 is charged at the third-tier rate', () => {
  // 5 * 15000 + 10 * 12000 + 1 * 10000
  assert.equal(tieredTotal(16, RATES.services), 205000);
});

test('service-location tier edge: 100 pages all at the first-tier rate', () => {
  // 100 * 3000
  assert.equal(tieredTotal(100, RATES.serviceLocation), 300000);
});

test('service-location tier edge: page 101 is charged at the second-tier rate', () => {
  // 100 * 3000 + 1 * 1500
  assert.equal(tieredTotal(101, RATES.serviceLocation), 301500);
});

test('service-location tier edge: page 1001 is charged at the third-tier rate', () => {
  // 100 * 3000 + 900 * 1500 + 1 * 800
  assert.equal(tieredTotal(1001, RATES.serviceLocation), 1650800);
});

test('50 services x 50 cities is 2,600 pages from 5 templates', () => {
  const price = calculatePrice({ ...none, servicePages: 50, cities: 50 });
  // pages: 50 + 50 + 50 * 50 = 2600
  assert.equal(price.pages, 2600);
  assert.equal(price.serviceLocation.pages, 2500);
  // templates: all-services, service, all-locations, location, service-location = 5 * 2500
  assert.equal(price.templates.count, 5);
  assert.equal(price.templates.cents, 12500);
  // services: 5 * 15000 + 10 * 12000 + 35 * 10000 = 545000; cities: 50 * 10000 = 500000
  // service-location: 100 * 3000 + 900 * 1500 + 1500 * 800 = 2850000
  assert.equal(price.services.cents, 545000);
  assert.equal(price.locations.cities, 500000);
  assert.equal(price.serviceLocation.cents, 2850000);
  // 12500 + 545000 + 500000 + 2850000
  assert.equal(price.totalCents, 3907500);
});

test('5 categories x 4 services on 10 locations is 250 service-location pages from 6 templates', () => {
  const price = calculatePrice({ ...none, categoryPages: 5, servicePages: 20, cities: 10 });
  // service-location: (5 * 10) + (20 * 10) = 250
  assert.equal(price.serviceLocation.pages, 250);
  // pages: 5 categories + 20 services + 10 locations + 250 = 285
  assert.equal(price.pages, 285);
  // templates: all-services, service, service category, all-locations, location, service-location = 6 * 2500
  assert.equal(price.templates.count, 6);
  assert.equal(price.templates.cents, 15000);
  // services: 5 * 15000 + 10 * 12000 + 5 * 10000 = 245000; cities: 10 * 10000 = 100000
  // service-location: 100 * 3000 + 150 * 1500 = 525000; the 5 category pages add no per-page charge
  assert.equal(price.services.cents, 245000);
  assert.equal(price.locations.cities, 100000);
  assert.equal(price.serviceLocation.cents, 525000);
  // 15000 + 245000 + 100000 + 525000
  assert.equal(price.totalCents, 885000);
});

test('categories add exactly one template: the service category template', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 1, cities: 1 }).templates.count, 5);
  assert.equal(calculatePrice({ ...none, servicePages: 1, cities: 1, categoryPages: 1 }).templates.count, 6);
});

test('category pages cost nothing per page: only the category template is added', () => {
  const without = calculatePrice({ ...none, servicePages: 5 });
  const withCategories = calculatePrice({ ...none, servicePages: 5, categoryPages: 4 });
  // without: 5 * 15000 + templates (all-services, service) 2 * 2500 = 80000
  assert.equal(without.totalCents, 80000);
  // with: 75000 + templates (all-services, service, service category) 3 * 2500 = 82500
  assert.equal(withCategories.totalCents, 82500);
});

test('category pages combine with locations just as services do', () => {
  const price = calculatePrice({ ...none, categoryPages: 2, cities: 5 });
  // (0 + 2) * 5 = 10 service-location pages
  assert.equal(price.serviceLocation.pages, 10);
});

test('service-location pages are services x every location page of every type', () => {
  const price = calculatePrice({ ...none, servicePages: 2, cities: 1, districts: 2, neighborhoods: 3 });
  // locations: 1 + 2 + 3 = 6; service-location: 2 * 6 = 12 pages * 3000
  assert.equal(price.serviceLocation.pages, 12);
  assert.equal(price.serviceLocation.cents, 36000);
  assert.equal(price.pages, 20);
});

test('no service-location pages without services or categories, or without locations', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 10 }).serviceLocation.pages, 0);
  assert.equal(calculatePrice({ ...none, categoryPages: 10 }).serviceLocation.pages, 0);
  assert.equal(calculatePrice({ ...none, cities: 10 }).serviceLocation.pages, 0);
});

test('services alone need two templates and locations alone need two', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 1 }).templates.count, 2);
  assert.equal(calculatePrice({ ...none, neighborhoods: 1 }).templates.count, 2);
});

test('location types are only labels: using all three adds no templates', () => {
  const price = calculatePrice({ ...none, servicePages: 1, cities: 1, districts: 1, neighborhoods: 1 });
  assert.equal(price.templates.count, 5);
});

test('5 cities + 30 districts + 10 neighborhoods is 45 locations and 2 templates', () => {
  const price = calculatePrice({ ...none, cities: 5, districts: 30, neighborhoods: 10 });
  assert.equal(price.pages, 45);
  assert.equal(price.templates.count, 2);
  // cities 5 * 10000 = 50000; districts 30 * 7000 = 210000; neighborhoods 10 * 4000 = 40000
  // templates: all-locations + per-location = 2 * 2500 = 5000
  assert.equal(price.totalCents, 305000);
});

test('each location type is charged at its own flat rate', () => {
  const price = calculatePrice({ ...none, cities: 3, districts: 4, neighborhoods: 5 });
  // cities 3 * 10000; districts 4 * 7000; neighborhoods 5 * 4000
  assert.equal(price.locations.cities, 30000);
  assert.equal(price.locations.districts, 28000);
  assert.equal(price.locations.neighborhoods, 20000);
  // 78000 + templates (all-locations + per-location) 2 * 2500 = 5000
  assert.equal(price.totalCents, 83000);
});

test('location types can be mixed freely, including only two of the three', () => {
  const price = calculatePrice({ ...none, cities: 6, neighborhoods: 10 });
  // 6 * 10000 + 10 * 4000 = 100000; templates: all-locations + per-location = 2 * 2500 = 5000
  assert.equal(price.locations.districts, 0);
  assert.equal(price.totalCents, 105000);
});

test('tops up to the minimum order for a services-only selection', () => {
  const price = calculatePrice({ ...none, servicePages: 1 });
  // 15000 + templates 2 * 2500 = 20000 selected; minimum 50000; top-up 30000
  assert.equal(price.minimumTopUpCents, 30000);
  assert.equal(price.totalCents, 50000);
});

test('tops up to the minimum order for a locations-only selection', () => {
  const price = calculatePrice({ ...none, neighborhoods: 1 });
  // 4000 + templates 2 * 2500 = 9000 selected; minimum 50000; top-up 41000
  assert.equal(price.minimumTopUpCents, 41000);
  assert.equal(price.totalCents, 50000);
});

test('no minimum is charged when nothing is selected', () => {
  const price = calculatePrice(none);
  assert.equal(price.pages, 0);
  assert.equal(price.templates.count, 0);
  assert.equal(price.minimumTopUpCents, 0);
  assert.equal(price.totalCents, 0);
});

test('rejects negative, fractional, non-numeric and oversized counts in every field', () => {
  for (const field of ['servicePages', 'categoryPages', 'cities', 'districts', 'neighborhoods']) {
    for (const bad of [-1, 1.5, NaN, '3', RATES.maxPages + 1]) {
      assert.throws(() => calculatePrice({ ...none, [field]: bad }), RangeError, field + ' = ' + bad);
    }
  }
});
