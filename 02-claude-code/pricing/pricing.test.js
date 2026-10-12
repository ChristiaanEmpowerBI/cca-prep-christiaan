'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tieredTotal, calculatePrice, RATES } = require('./pricing.js');

const allStandard = { home: true, about: true, privacy: true, contact: true };
// A new website: nothing chosen yet, all four standard pages wanted.
const none = {
  servicePages: 0,
  categoryPages: 0,
  cities: 0,
  districts: 0,
  neighborhoods: 0,
  standardPages: allStandard,
};

test('service-location tiers: zero pages cost nothing', () => {
  assert.equal(tieredTotal(0, RATES.serviceLocation), 0);
});

test('service-location tier edge: 500 pages are all at the first-tier rate', () => {
  // 500 * 500
  assert.equal(tieredTotal(500, RATES.serviceLocation), 250000);
});

test('service-location tier edge: page 501 is charged at the second-tier rate', () => {
  // 500 * 500 + 1 * 400
  assert.equal(tieredTotal(501, RATES.serviceLocation), 250400);
});

test('service-location tier edge: 1,000 pages end the second tier', () => {
  // 500 * 500 + 500 * 400
  assert.equal(tieredTotal(1000, RATES.serviceLocation), 450000);
});

test('service-location tier edge: page 1,001 is charged at the third-tier rate', () => {
  // 500 * 500 + 500 * 400 + 1 * 300
  assert.equal(tieredTotal(1001, RATES.serviceLocation), 450300);
});

test('1,500 service-location pages cost 6,000.00', () => {
  // 500 * 500 + 500 * 400 + 500 * 300 = 250000 + 200000 + 150000
  assert.equal(tieredTotal(1500, RATES.serviceLocation), 600000);
});

test('3 categories, 10 services, 2 cities, 10 neighborhoods is 181 pages from 6 templates', () => {
  const price = calculatePrice({ ...none, categoryPages: 3, servicePages: 10, cities: 2, neighborhoods: 10 });
  // locations: 2 + 10 = 12; service-location: (10 + 3) * 12 = 156
  assert.equal(price.serviceLocation.pages, 156);
  // pages: 3 + 10 + 12 + 156 = 181
  assert.equal(price.pages, 181);
  // templates: all-services, service, service category, all-locations, location, service-location = 6 * 2500
  assert.equal(price.templates.count, 6);
  assert.equal(price.templates.cents, 15000);
  // 3 * 500; 10 * 500; 2 * 500; 10 * 500; 156 * 500
  assert.equal(price.categories.cents, 1500);
  assert.equal(price.services.cents, 5000);
  assert.equal(price.locations.cities, 1000);
  assert.equal(price.locations.neighborhoods, 5000);
  assert.equal(price.serviceLocation.cents, 78000);
  // 15000 templates + 10000 standard pages + 1500 + 5000 + 1000 + 5000 + 78000
  assert.equal(price.totalCents, 115500);
});

test('50 services x 50 cities is 2,600 pages from 5 templates', () => {
  const price = calculatePrice({ ...none, servicePages: 50, cities: 50 });
  // pages: 50 + 50 + 50 * 50 = 2600
  assert.equal(price.pages, 2600);
  assert.equal(price.serviceLocation.pages, 2500);
  // templates: all-services, service, all-locations, location, service-location = 5 * 2500
  assert.equal(price.templates.count, 5);
  assert.equal(price.templates.cents, 12500);
  // service-location: 500 * 500 + 500 * 400 + 1500 * 300 = 250000 + 200000 + 450000 = 900000
  assert.equal(price.serviceLocation.cents, 900000);
  // 12500 templates + 10000 standard pages + services 50 * 500 + cities 50 * 500 + 900000
  assert.equal(price.totalCents, 972500);
});

test('30 services x 50 cities is 1,500 service-location pages', () => {
  const price = calculatePrice({ ...none, servicePages: 30, cities: 50 });
  assert.equal(price.serviceLocation.pages, 1500);
  assert.equal(price.serviceLocation.cents, 600000);
  // templates 5 * 2500 = 12500; standard pages 10000; services 30 * 500 = 15000; cities 50 * 500 = 25000; 600000
  assert.equal(price.totalCents, 662500);
});

test('5 categories x 4 services on 10 locations is 250 service-location pages from 6 templates', () => {
  const price = calculatePrice({ ...none, categoryPages: 5, servicePages: 20, cities: 10 });
  // service-location: (5 * 10) + (20 * 10) = 250
  assert.equal(price.serviceLocation.pages, 250);
  // pages: 5 categories + 20 services + 10 locations + 250 = 285
  assert.equal(price.pages, 285);
  assert.equal(price.templates.count, 6);
  // 6 * 2500 templates + 10000 standard pages + 285 pages * 500
  assert.equal(price.totalCents, 167500);
});

test('5 cities + 30 districts + 10 neighborhoods is 45 locations and 2 templates', () => {
  const price = calculatePrice({ ...none, cities: 5, districts: 30, neighborhoods: 10 });
  assert.equal(price.pages, 45);
  assert.equal(price.templates.count, 2);
  // templates 2 * 2500 = 5000; standard pages 10000; pages 45 * 500 = 22500
  assert.equal(price.totalCents, 37500);
});

test('every page type is charged at its own page rate', () => {
  const price = calculatePrice({ ...none, categoryPages: 1, servicePages: 2, cities: 3, districts: 4, neighborhoods: 5 });
  assert.equal(price.categories.cents, 500);
  assert.equal(price.services.cents, 1000);
  assert.equal(price.locations.cities, 1500);
  assert.equal(price.locations.districts, 2000);
  assert.equal(price.locations.neighborhoods, 2500);
  // service-location: (2 + 1) * (3 + 4 + 5) = 36 pages * 500
  assert.equal(price.serviceLocation.cents, 18000);
});

test('a changed page rate flows through to the total', () => {
  const rates = { ...RATES, serviceLocation: [{ upTo: Infinity, unitCents: 100 }] };
  const price = calculatePrice({ ...none, servicePages: 2, cities: 3 }, rates);
  // service-location: 2 * 3 = 6 pages * 100 = 600
  assert.equal(price.serviceLocation.cents, 600);
});

test('categories add exactly one template: the service category template', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 1, cities: 1 }).templates.count, 5);
  assert.equal(calculatePrice({ ...none, servicePages: 1, cities: 1, categoryPages: 1 }).templates.count, 6);
});

test('services alone need two templates and locations alone need two', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 1 }).templates.count, 2);
  assert.equal(calculatePrice({ ...none, neighborhoods: 1 }).templates.count, 2);
});

test('location types are only labels: using all three adds no templates', () => {
  const price = calculatePrice({ ...none, servicePages: 1, cities: 1, districts: 1, neighborhoods: 1 });
  assert.equal(price.templates.count, 5);
});

test('category pages combine with locations just as services do', () => {
  const price = calculatePrice({ ...none, categoryPages: 2, cities: 5 });
  // (0 + 2) * 5 = 10 service-location pages
  assert.equal(price.serviceLocation.pages, 10);
});

test('service-location pages are services x every location page of every type', () => {
  const price = calculatePrice({ ...none, servicePages: 2, cities: 1, districts: 2, neighborhoods: 3 });
  // locations: 1 + 2 + 3 = 6; service-location: 2 * 6 = 12 pages
  assert.equal(price.serviceLocation.pages, 12);
  assert.equal(price.pages, 20);
});

test('no service-location pages without services or categories, or without locations', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 10 }).serviceLocation.pages, 0);
  assert.equal(calculatePrice({ ...none, categoryPages: 10 }).serviceLocation.pages, 0);
  assert.equal(calculatePrice({ ...none, cities: 10 }).serviceLocation.pages, 0);
});

test('all four standard pages at 25.00 each when the visitor wants them all', () => {
  const price = calculatePrice({ ...none, servicePages: 1 });
  // home, about us, privacy policy, contact us = 4 * 2500
  assert.equal(price.standardPages.count, 4);
  assert.equal(price.standardPages.cents, 10000);
});

test('each standard page costs 25.00 and can be chosen on its own', () => {
  for (const key of Object.keys(allStandard)) {
    const price = calculatePrice({ ...none, standardPages: { [key]: true } });
    assert.equal(price.standardPages.count, 1, key);
    assert.equal(price.standardPages.cents, 2500, key);
  }
});

test('two standard pages chosen: home and contact us are 50.00', () => {
  const price = calculatePrice({ ...none, standardPages: { home: true, contact: true } });
  assert.equal(price.standardPages.count, 2);
  assert.equal(price.standardPages.cents, 5000);
});

test('existing website: unticking all four standard pages removes their cost', () => {
  const price = calculatePrice({ ...none, servicePages: 2, cities: 3, standardPages: {} });
  // 2 services on 3 cities was 28000 with standard pages; without them 28000 - 10000
  assert.equal(price.standardPages.count, 0);
  assert.equal(price.standardPages.cents, 0);
  assert.equal(price.totalCents, 18000);
  assert.equal(price.belowMinimum, true);
});

test('a missing standardPages input means none are wanted', () => {
  const { standardPages, ...withoutStandard } = none;
  assert.equal(standardPages, allStandard);
  assert.equal(calculatePrice(withoutStandard).standardPages.count, 0);
});

test('nothing at all selected, with no standard pages, costs nothing', () => {
  const price = calculatePrice({ ...none, standardPages: {} });
  assert.equal(price.totalCents, 0);
});

test('standard pages are not templated pages: they add no templates and no page count', () => {
  const price = calculatePrice(none);
  assert.equal(price.pages, 0);
  assert.equal(price.templates.count, 0);
});

test('2 services on 3 cities is 280.00 and below the minimum project size', () => {
  const price = calculatePrice({ ...none, servicePages: 2, cities: 3 });
  // service-location: 2 * 3 = 6; pages: 2 + 3 + 6 = 11 * 500 = 5500
  // templates 5 * 2500 = 12500; standard pages 10000
  assert.equal(price.pages, 11);
  assert.equal(price.totalCents, 28000);
  assert.equal(price.belowMinimum, true);
});

test('a project below the minimum is not topped up: the price stays as calculated', () => {
  const price = calculatePrice({ ...none, servicePages: 1 });
  // templates 2 * 2500 = 5000; standard pages 10000; 1 page * 500
  assert.equal(price.totalCents, 15500);
  assert.equal(price.belowMinimum, true);
});

test('minimum boundary: 499.00 is declined and exactly 500.00 is accepted', () => {
  // 69 services: templates 5000 + standard 10000 + 69 * 500 = 49500
  const below = calculatePrice({ ...none, servicePages: 69 });
  assert.equal(below.totalCents, 49500);
  assert.equal(below.belowMinimum, true);
  // 70 services: 5000 + 10000 + 70 * 500 = 50000
  const exact = calculatePrice({ ...none, servicePages: 70 });
  assert.equal(exact.totalCents, 50000);
  assert.equal(exact.belowMinimum, false);
});

test('a large order is not below the minimum', () => {
  assert.equal(calculatePrice({ ...none, servicePages: 50, cities: 50 }).belowMinimum, false);
});

test('nothing selected, with all four standard pages, costs only those pages and is below the minimum', () => {
  const price = calculatePrice(none);
  assert.equal(price.totalCents, 10000);
  assert.equal(price.belowMinimum, true);
});

test('rejects negative, fractional, non-numeric and oversized counts in every field', () => {
  for (const field of ['servicePages', 'categoryPages', 'cities', 'districts', 'neighborhoods']) {
    for (const bad of [-1, 1.5, NaN, '3', RATES.maxPages + 1]) {
      assert.throws(() => calculatePrice({ ...none, [field]: bad }), RangeError, field + ' = ' + bad);
    }
  }
});
