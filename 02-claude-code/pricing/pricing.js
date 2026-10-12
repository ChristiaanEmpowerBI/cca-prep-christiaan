(function () {
  'use strict';

  // All money is integer cents. Change rules here, nowhere else.
  // CONFIRMED rates, except districts: no rate was given, so they are assumed to match the other pages.
  const RATES = {
    templateCents: 2500,
    // Optional pages (see STANDARD_PAGES) the visitor ticks when the site does not already have them.
    // Each is priced individually, so none is counted as a templated page.
    standardPageCents: 2500,
    // Projects priced below this are not taken on. The price is not topped up; the visitor is told instead.
    minimumCents: 50000,
    pageCents: {
      categories: 500,
      services: 500,
      cities: 500,
      districts: 500,
      neighborhoods: 500,
    },
    // Service-location pages are graduated: each page is charged at the rate of the tier it falls in.
    serviceLocation: [
      { upTo: 500, unitCents: 500 },
      { upTo: 1000, unitCents: 400 },
      { upTo: Infinity, unitCents: 300 },
    ],
    maxPages: 500,
  };

  const LOCATION_TYPES = [
    { key: 'cities', label: 'City pages' },
    { key: 'districts', label: 'District pages' },
    { key: 'neighborhoods', label: 'Neighborhood pages' },
  ];

  const STANDARD_PAGES = [
    { key: 'home', label: 'home' },
    { key: 'about', label: 'about us' },
    { key: 'privacy', label: 'privacy policy' },
    { key: 'contact', label: 'contact us' },
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

    const { pageCents } = rates;
    const servicesCents = input.servicePages * pageCents.services;
    const categoriesCents = input.categoryPages * pageCents.categories;

    const locations = {};
    let locationsCents = 0;
    let locationPages = 0;
    for (const { key } of LOCATION_TYPES) {
      locations[key] = input[key] * pageCents[key];
      locationsCents += locations[key];
      locationPages += input[key];
    }

    // Every service and every category gets a page on every location.
    const serviceLocationPages = (input.servicePages + input.categoryPages) * locationPages;
    const serviceLocationCents = tieredTotal(serviceLocationPages, rates.serviceLocation);

    const templateCount = countTemplates(input.servicePages > 0, input.categoryPages > 0, locationPages > 0);
    const templatesCents = templateCount * rates.templateCents;
    // A missing standardPages input means none are wanted.
    const chosen = input.standardPages || {};
    const standardPageCount = STANDARD_PAGES.filter(({ key }) => chosen[key]).length;
    const standardPagesCents = standardPageCount * rates.standardPageCents;
    const totalCents =
      templatesCents + standardPagesCents + servicesCents + categoriesCents + locationsCents + serviceLocationCents;

    return {
      pages: input.servicePages + input.categoryPages + locationPages + serviceLocationPages,
      templates: { count: templateCount, cents: templatesCents },
      standardPages: { count: standardPageCount, cents: standardPagesCents },
      services: { cents: servicesCents },
      categories: { cents: categoriesCents },
      locations,
      serviceLocation: { pages: serviceLocationPages, cents: serviceLocationCents },
      totalCents,
      belowMinimum: totalCents < rates.minimumCents,
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
      const standardPages = {};
      for (const { key } of STANDARD_PAGES) standardPages[key] = els[key].checked;
      let price;
      try {
        price = calculatePrice({ ...counts, standardPages });
      } catch (err) {
        result.textContent = 'Enter whole numbers from 0 to ' + RATES.maxPages + '.';
        return;
      }

      const list = document.createElement('ul');
      list.className = 'ebi-pricing__rows';
      if (price.templates.count) {
        list.append(row('Templates (' + price.templates.count + ')', price.templates.cents, format));
      }
      if (price.standardPages.count) {
        const names = STANDARD_PAGES.filter(({ key }) => standardPages[key]).map(({ label }) => label);
        list.append(row('Standard pages (' + names.join(', ') + ')', price.standardPages.cents, format));
      }
      if (counts.categoryPages) {
        list.append(row('Service category pages (' + numbers.format(counts.categoryPages) + ')', price.categories.cents, format));
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
      list.append(row('Estimated total', price.totalCents, format, 'ebi-pricing__row--total'));

      const summary = document.createElement('p');
      summary.className = 'ebi-pricing__summary';
      const standardNote = price.standardPages.count
        ? ', plus ' + price.standardPages.count + ' standard ' + (price.standardPages.count === 1 ? 'page' : 'pages')
        : '';
      summary.textContent = price.pages
        ? numbers.format(price.pages) + ' pages built from ' + price.templates.count + ' templates' + standardNote
        : 'Choose how many pages you need.';
      const children = [summary, list];
      if (price.belowMinimum) {
        const notice = document.createElement('p');
        notice.className = 'ebi-pricing__notice';
        notice.textContent =
          'Although the estimated price is ' + format.format(price.totalCents / 100) +
          ', we do not take on projects smaller than ' + format.format(RATES.minimumCents / 100) + '.';
        children.push(notice);
      }
      result.replaceChildren(...children);
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
