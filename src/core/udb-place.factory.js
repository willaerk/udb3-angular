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
    this.type = {};
    this.theme = {};
    this.openinghours = [];
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

    /**
     * Set the name of the event for a given langcode.
     */
    setName: function(name, langcode) {
      this.name[langcode] = name;
    },

    /**
     * Get the name of the event for a given langcode.
     */
    getName: function(langcode) {
      return this.name[langcode];
    },

    /**
     * Set the event type for this event.
     */
    setEventType: function(id, label) {
      this.type = {
        'id' : id,
        'label' : label,
        'domain' : 'eventtype',
      };
    },

    /**
     * Get the event type for this event.
     */
    getEventType: function() {
      return this.type;
    },

    /**
     * Get the label for the event type.
     */
    getEventTypeLabel: function() {
      return this.type.label ? this.type.label : '';
    },

    /**
     * Set the event type for this event.
     */
    setTheme: function(id, label) {
      this.theme = {
        'id' : id,
        'label' : label,
        'domain' : 'thema',
      };
    },

    /**
     * Get the event type for this event.
     */
    getTheme: function() {
      return this.theme;
    },

    /**
     * Get the label for the theme.
     */
    getThemeLabel: function() {
      return this.theme.label ? this.theme.label : '';
    },

    /**
     * Reset the opening hours.
     */
    resetOpeningHours: function() {
      this.openinghours = [];
    },

    /**
     * Get the opening hours for this event.
     */
    getOpeningHours: function() {
      return this.openinghours;
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