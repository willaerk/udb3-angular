'use strict';

/**
 * @ngdoc filter
 * @name udb.search.filter:currency
 * @function
 * @description
 * # currency
 * Custom currency filter to display event prices
 */
angular
  .module('udb.search')
  .filter('currency', CurrencyFilter);

/* @ngInject */
function CurrencyFilter() {
  return function (number, currencyCode) {
    var currencies = {
      // Source: Interinstitutional Style Guide of the EU
      // Chapter 7.3.3. Rules for expressing monetary units
      // http://publications.europa.eu/code/en/en-370303.htm
      EUR: {
        symbol: '',
        thousand: '.',
        decimal: ',',
        format: '%s%v',
        precision: 2
      }
    };

    var currency = currencies[currencyCode];
    // Default to Euro if the currency is not defined
    if (!currency) {
      currency = currencies.EUR;
    }

    return accounting.formatMoney(number, currency);
  };
}
