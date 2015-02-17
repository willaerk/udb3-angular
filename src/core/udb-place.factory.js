'use strict';

/**
 * @ngdoc service
 * @name udb.core.UdbTimestamps
 * @description
 * # UdbTimestamps
 * Contains timestamps info for the calendar
 */
angular
  .module('udb.core')
  .factory('UdbPlace', UdbPlaceFactory);

/* @ngInject */
function UdbPlaceFactory() {

  /**
   * @class UdbPlace
   * @constructor
   */
  var UdbPlace = function () {
    this.name = '';
    this.address = {
      'addressCountry' : '',
      'addressLocality' : '',
      'postalCode' : '',
      'streetAddress' : '',
    };
  };

  UdbPlace.prototype = {
    parseJson: function (json) {

    },

    setName: function(name) {
      this.name = name;
    },

    setCountry: function(country) {
      this.address.country = country;
    },

    setLocality: function(locality) {
      this.address.addressLocality = locality;
    },

    setPostal: function(postalCode) {
      this.address.postalCode = postalCode;
    },

    setStreet: function(street) {
      this.address.streetAddress = street;
    },

    getName: function() {
      return this.name;
    },

    getCountry: function() {
      return this.address.country;
    },

    getLocality: function() {
      return this.address.addressLocality;
    },

    getPostal: function() {
      return this.address.postalCode;
    },

    getStreet: function(street) {
      return this.address.streetAddress;
    }

  };

  return (UdbPlace);
}
