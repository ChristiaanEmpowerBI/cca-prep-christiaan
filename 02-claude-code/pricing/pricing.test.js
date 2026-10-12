'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { tieredTotal, calculatePrice, RATES } = require('./pricing.js');

const none = { servicePages: 0, locationPages: 0, servicesHierarchical: false, locationsHierarchical: false };

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

test('location tier edge: page 10 is charged at the second-tier rate', () => {
  // 9 * 8000 + 1 * 6500
  assert.equal(tieredTotal(10, RATES.locations), 78500);
});

test('adds 15% surcharge to hierarchical service pages only', () => {
  const price = calculatePrice({ ...none, servicePages: 10, servicesHierarchical: true });
  // base: 5 * 15000 + 5 * 12000 = 135000; surcharge: 135000 * 15% = 20250
  assert.equal(price.services.baseCents, 135000);
  assert.equal(price.services.surchargeCents, 20250);
  assert.equal(price.locations.surchargeCents, 0);
  assert.equal(price.totalCents, 155250);
});

test('hierarchy flag on a type with zero pages costs nothing', () => {
  const price = calculatePrice({ ...none, servicesHierarchical: true, locationsHierarchical: true });
  assert.equal(price.totalCents, 0);
});

test('tops up to the minimum order when something is selected', () => {
  const price = calculatePrice({ ...none, servicePages: 1 });
  // 15000 selected; minimum 50000; top-up 35000
  assert.equal(price.minimumTopUpCents, 35000);
  assert.equal(price.totalCents, 50000);
});

test('no minimum is charged when nothing is selected', () => {
  const price = calculatePrice(none);
  assert.equal(price.minimumTopUpCents, 0);
  assert.equal(price.totalCents, 0);
});

test('services and locations combine into one total', () => {
  const price = calculatePrice({ ...none, servicePages: 6, locationPages: 10 });
  // 87000 + 78500
  assert.equal(price.totalCents, 165500);
});

test('rejects negative, fractional, non-numeric and oversized counts', () => {
  for (const bad of [-1, 1.5, NaN, '3', RATES.maxPages + 1]) {
    assert.throws(() => calculatePrice({ ...none, servicePages: bad }), RangeError);
    assert.throws(() => calculatePrice({ ...none, locationPages: bad }), RangeError);
  }
});
