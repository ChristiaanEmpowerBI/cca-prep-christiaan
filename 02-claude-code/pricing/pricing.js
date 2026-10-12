(function () {
  'use strict';

  // All money is integer cents. Change rules here, nowhere else.
  // CONFIRMED: templateCents. Every other rate is a PLACEHOLDER until agreed.
  const RATES = {
    templateCents: 2500,
    // Graduated tiers: pages 1-5 cost 150.00 each, pages 6-15 cost 120.00 each, and so on.
    services: [
      { upTo: 5, unitCents: 15000 },
      { upTo: 15, unitCents: 12000 },
      { upTo: Infinity, unitCents: 10000 },
    ],
    // One flat rate per location type. Locations have no hierarchy.
    locationUnitCents: { cities: 10000, districts: 7000, neighborhoods: 4000 },
    // Service-location pages ((services + categories) x locations) are templated, so they get cheaper at volume.
    serviceLocation: [
      { upTo: 100, unitCents: 3000 },
      { upTo: 1000, unitCents: 1500 },
      { upTo: Infinity, unitCents: 800 },
    ],
    minimumCents: 50000,
    maxPages: 500,
  };

  const LOCATION_TYPES = [
    { key: 'cities', label: 'City pages' },
    { key: 'districts', label: 'District pages' },
    { key: 'neighborhoods', label: 'Neighborhood pages' },
  ];

  function tieredTotal(count, tiers) {
    let remaining = count;
    let previousLimit = 0;
    let total = 0;
    for (const { upTo, unitCents } of tiers) {
      const inTier = Math.min(remaining, upTo - previousLimit);
      if (inTier <= 0) break;
      total += inTier * unitCents;
      remaining -= inTier;
      previousLimit = upTo;
    }
    return total;
  }

  function checkCount(name, value, maxPages) {
    if (!Number.isInteger(value) || value < 0 || value > maxPages) {
      throw new RangeError(name + ' must be a whole number from 0 to ' + maxPages);
    }
  }

  function countTemplates(hasServices, hasCategories, hasLocations) {
    let count = 0;
    if (hasServices) count += 2; // all-services + per-service
    if (hasCategories) count += 1; // service category
    if (hasLocations) count += 2; // all-locations + per-location, however many location types are used
    if ((hasServices || hasCategories) && hasLocations) count += 1; // service-location (covers category-location too)
    return count;
  }

  function calculatePrice(input, rates = RATES) {
    checkCount('servicePages', input.servicePages, rates.maxPages);
    checkCount('categoryPages', input.categoryPages, rates.maxPages);
    for (const { key } of LOCATION_TYPES) checkCount(key, input[key], rates.maxPages);

    const servicesCents = tieredTotal(input.servicePages, rates.services);

    const locations = {};
    let locationsCents = 0;
    let locationPages = 0;
    for (const { key } of LOCATION_TYPES) {
      locations[key] = input[key] * rates.locationUnitCents[key];
      locationsCents += locations[key];
      locationPages += input[key];
    }

    // Every service and every category gets a page on every location.
    const serviceLocationPages = (input.servicePages + input.categoryPages) * locationPages;
    const serviceLocationCents = tieredTotal(serviceLocationPages, rates.serviceLocation);

    const templateCount = countTemplates(input.servicePages > 0, input.categoryPages > 0, locationPages > 0);
    const templatesCents = templateCount * rates.templateCents;

    // Category pages have no per-page price: the category template (inside templatesCents) covers them.
    const subtotalCents = servicesCents + locationsCents + serviceLocationCents + templatesCents;
    // The minimum only applies once the visitor has chosen something.
    const minimumTopUpCents =
      subtotalCents > 0 && subtotalCents < rates.minimumCents ? rates.minimumCents - subtotalCents : 0;

    return {
      pages: input.servicePages + input.categoryPages + locationPages + serviceLocationPages,
      templates: { count: templateCount, cents: templatesCents },
      services: { cents: servicesCents },
      locations,
      serviceLocation: { pages: serviceLocationPages, cents: serviceLocationCents },
      minimumTopUpCents,
      totalCents: subtotalCents + minimumTopUpCents,
    };
  }

  function row(label, cents, format, className) {
    const li = document.createElement('li');
    li.className = 'ebi-pricing__row' + (className ? ' ' + className : '');
    const name = document.createElement('span');
    name.textContent = label;
    const amount = document.createElement('span');
    amount.textContent = format.format(cents / 100);
    li.append(name, amount);
    return li;
  }

  function init(rootEl) {
    const form = rootEl.querySelector('.ebi-pricing__form');
    const result = rootEl.querySelector('.ebi-pricing__result');
    const locale = rootEl.dataset.locale || 'en-GB';
    const format = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: rootEl.dataset.currency || 'EUR',
    });
    const numbers = new Intl.NumberFormat(locale);

    function render() {
      const els = form.elements;
      const counts = {
        servicePages: Number(els.servicePages.value),
        categoryPages: Number(els.categoryPages.value),
        cities: Number(els.cities.value),
        districts: Number(els.districts.value),
        neighborhoods: Number(els.neighborhoods.value),
      };
      let price;
      try {
        price = calculatePrice(counts);
      } catch (err) {
        result.textContent = 'Enter whole numbers from 0 to ' + RATES.maxPages + '.';
        return;
      }

      const list = document.createElement('ul');
      list.className = 'ebi-pricing__rows';
      if (price.templates.count) {
        list.append(row('Templates (' + price.templates.count + ')', price.templates.cents, format));
      }
      if (counts.servicePages) {
        list.append(row('Service pages (' + numbers.format(counts.servicePages) + ')', price.services.cents, format));
      }
      for (const { key, label } of LOCATION_TYPES) {
        if (counts[key]) {
          list.append(row(label + ' (' + numbers.format(counts[key]) + ')', price.locations[key], format));
        }
      }
      if (price.serviceLocation.pages) {
        list.append(
          row(
            'Service-location pages (' + numbers.format(price.serviceLocation.pages) + ')',
            price.serviceLocation.cents,
            format
          )
        );
      }
      if (price.minimumTopUpCents) list.append(row('Minimum order adjustment', price.minimumTopUpCents, format));
      list.append(row('Estimated total', price.totalCents, format, 'ebi-pricing__row--total'));

      const summary = document.createElement('p');
      summary.className = 'ebi-pricing__summary';
      summary.textContent = price.pages
        ? numbers.format(price.pages) + ' pages built from ' + price.templates.count + ' templates'
        : 'Choose how many pages you need.';
      result.replaceChildren(summary, list);
    }

    form.addEventListener('input', render);
    render();
  }

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RATES, tieredTotal, calculatePrice };
  }

  if (typeof document !== 'undefined') {
    document.querySelectorAll('.ebi-pricing:not([data-ebi-ready])').forEach(function (el) {
      el.setAttribute('data-ebi-ready', '');
      init(el);
    });
  }
})();
