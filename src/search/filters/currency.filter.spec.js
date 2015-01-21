'use strict';

describe('Filter: currency', function () {

  // load the filter's module
  beforeEach(module('udb.search'));

  // initialize a new instance of the filter before each test
  var currency;
  beforeEach(inject(function ($filter) {
    currency = $filter('currency');
  }));

  it('should format a float as Euro', function () {
    var formattedPrice = '12,30';
    expect(currency(12.3)).toBe(formattedPrice);
  });

  it('should append decimals to a flat number', function () {
    var formattedPrice = '12,00';
    expect(currency(12)).toBe(formattedPrice);
  });

  it('should round off more than 2 decimals', function () {
    var formattedPrice = '12,35';
    expect(currency(12.3456)).toBe(formattedPrice);
  });

});
