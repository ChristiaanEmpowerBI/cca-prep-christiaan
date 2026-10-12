(function () {
  'use strict';

  // PLACEHOLDER RATES. All money is integer cents. Change rules here, nowhere else.
  // Tiers are graduated: pages 1-5 cost 150.00 each, pages 6-15 cost 120.00 each, and so on.
  const RATES = {
    services: [
      { upTo: 5, unitCents: 15000 },
      { upTo: 15, unitCents: 12000 },
      { upTo: Infinity, unitCents: 10000 },
    ],
    locations: [
      { upTo: 9, unitCents: 8000 },
      { upTo: Infinity, unitCents: 6500 },
    ],
    hierarchySurchargePct: 15,
    minimumCents: 50000,
    maxPages: 500,
  };

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

  function priceType(count, hierarchical, tiers, surchargePct) {
    const baseCents = tieredTotal(count, tiers);
    const surchargeCents = hierarchical ? Math.round((baseCents * surchargePct) / 100) : 0;
    return { baseCents, surchargeCents };
  }

  function calculatePrice(input, rates = RATES) {
    const { servicePages, locationPages, servicesHierarchical, locationsHierarchical } = input;
    checkCount('servicePages', servicePages, rates.maxPages);
    checkCount('locationPages', locationPages, rates.maxPages);

    const services = priceType(servicePages, servicesHierarchical, rates.services, rates.hierarchySurchargePct);
    const locations = priceType(locationPages, locationsHierarchical, rates.locations, rates.hierarchySurchargePct);

    const subtotalCents =
      services.baseCents + services.surchargeCents + locations.baseCents + locations.surchargeCents;
    // The minimum only applies once the visitor has chosen something.
    const minimumTopUpCents =
      subtotalCents > 0 && subtotalCents < rates.minimumCents ? rates.minimumCents - subtotalCents : 0;

    return {
      services,
      locations,
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
    const format = new Intl.NumberFormat(rootEl.dataset.locale || 'en-GB', {
      style: 'currency',
      currency: rootEl.dataset.currency || 'EUR',
    });

    function render() {
      const els = form.elements;
      let price;
      try {
        price = calculatePrice({
          servicePages: Number(els.servicePages.value),
          locationPages: Number(els.locationPages.value),
          servicesHierarchical: els.servicesHierarchical.checked,
          locationsHierarchical: els.locationsHierarchical.checked,
        });
      } catch (err) {
        result.textContent = 'Enter whole numbers from 0 to ' + RATES.maxPages + '.';
        return;
      }

      const list = document.createElement('ul');
      list.className = 'ebi-pricing__rows';
      const s = price.services;
      const l = price.locations;
      list.append(row('Service pages', s.baseCents, format));
      if (s.surchargeCents) list.append(row('Service hierarchy surcharge', s.surchargeCents, format));
      list.append(row('Location pages', l.baseCents, format));
      if (l.surchargeCents) list.append(row('Location hierarchy surcharge', l.surchargeCents, format));
      if (price.minimumTopUpCents) list.append(row('Minimum order adjustment', price.minimumTopUpCents, format));
      list.append(row('Estimated total', price.totalCents, format, 'ebi-pricing__row--total'));
      result.replaceChildren(list);
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
