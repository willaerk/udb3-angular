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
function UdbPlaceFactory(placeCategories) {

  function getCategoryByType(jsonPlace, domain) {
    var category = _.find(jsonPlace.terms, function (category) {
      return category.domain === domain;
    });

    if (category) {
      return category;
    }

    return;
  }

  /**
   * Return all categories for a given type.
   */
  function getCategoriesByType(jsonPlace, domain) {
    var categories = [];

    if (jsonPlace.terms) {
      for (var i = 0; i < jsonPlace.terms.length; i++) {
        if (jsonPlace.terms[i].domain === domain) {
          categories.push(jsonPlace.terms[i]);
        }
      }
    }

    return categories;
  }

  /**
   * Get the images that exist for this event.
   */
  function getImages(jsonPlace) {

    var images = [];
    if (jsonPlace.mediaObject) {
      for (var i = 0; i < jsonPlace.mediaObject.length; i++) {
        if (jsonPlace.mediaObject[i]['@type'] === 'ImageObject') {
          images.push(jsonPlace.mediaObject[i]);
        }
      }
    }

    return images;

  }

  /**
   * @class UdbPlace
   * @constructor
   */
  var UdbPlace = function (placeJson) {
    this.id = '';
    this.name = {};
    this.type = '';
    this.theme = {};
    this.calendarType = '';
    this.openinghours = [];
    this.address = {
      'addressCountry' : '',
      'addressLocality' : '',
      'postalCode' : '',
      'streetAddress' : '',
    };

    if (placeJson) {
      this.parseJson(placeJson);
    }
  };

  UdbPlace.prototype = {
    parseJson: function (jsonPlace) {

      this.id = jsonPlace['@id'] ? jsonPlace['@id'].split('/').pop() : '';
      this.name = jsonPlace.name || '';
      this.address = jsonPlace.address || this.address;
      this.theme = getCategoryByType(jsonPlace, 'theme') || {};
      this.description = jsonPlace.description || '';
      this.calendarType = jsonPlace.calendarType || '';
      this.startDate = jsonPlace.startDate;
      this.endDate = jsonPlace.endDate;
      this.openingHours = jsonPlace.openingHours || [];
      this.typicalAgeRange = jsonPlace.typicalAgeRange || '';
      this.bookingInfo = jsonPlace.bookingInfo || {};
      this.contactPoint = jsonPlace.contactPoint || {};
      if (jsonPlace.organizer) {
        this.organizer = jsonPlace.organizer;
      }
      this.image = getImages(jsonPlace);
      this.mediaObject = jsonPlace.mediaObject || [];
      this.facilities = getCategoriesByType(jsonPlace, 'facility') || [];
      this.additionalData = jsonPlace.additionalData || {};
      if (jsonPlace['@id']) {
        this.url = '/place/' + this.id;
      }
      this.creator = jsonPlace.creator;
      this.modified = jsonPlace.modified;

      if (jsonPlace.terms) {
        var place = this;

        // Only add terms related to locations.
        angular.forEach(jsonPlace.terms, function (term) {
          angular.forEach(placeCategories, function(category) {
            if (term.id === category.id) {
              place.type = term;
              return;
            }
          });
        });
      }

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
