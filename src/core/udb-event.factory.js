'use strict';

/**
 * @ngdoc service
 * @name udb.core.UdbEvent
 * @description
 * # UdbEvent
 * UdbEvent factory
 */
angular
  .module('udb.core')
  .factory('UdbEvent', UdbEventFactory);

/* @ngInject */
function UdbEventFactory() {

  var EventPricing = {
    FREE: 'free',
    UNKNOWN: 'unknown',
    PAYED: 'payed'
  };

  function getCategoryByType(jsonEvent, domain) {
    var category = _.find(jsonEvent.terms, function (category) {
      return category.domain === domain;
    });

    if (category) {
      return category.label;
    }

    return;
  }

  function getPricing(jsonEvent) {
    var pricing = EventPricing.UNKNOWN;

    if (jsonEvent.bookingInfo && jsonEvent.bookingInfo.length > 0) {
      var price = parseFloat(jsonEvent.bookingInfo[0].price);
      if (price > 0) {
        pricing = EventPricing.PAYED;
      } else {
        pricing = EventPricing.FREE;
      }
    }

    return pricing;
  }

  /**
   * @class UdbEvent
   * @constructor
   * @param jsonEvent
   */
  var UdbEvent = function () {
    this.id = '';
    this.name = {};
    this.place = {};
    this.type = {};
    this.theme = {};
    this.calendar = {};
  };

  UdbEvent.prototype = {
    parseJson: function (jsonEvent) {
      this.id = jsonEvent['@id'].split('/').pop();
      this.name = jsonEvent.name || {};
      this.description = jsonEvent.description || {};
      this.calendarSummary = jsonEvent.calendarSummary;
      this.location = jsonEvent.location;
      this.image = jsonEvent.image;
      this.labels = _.map(jsonEvent.keywords, function (label) {
        return label;
      });
      if (jsonEvent.organizer) {
        this.organizer = {
          name: jsonEvent.organizer.name,
          email: jsonEvent.organizer.email ? (jsonEvent.organizer.email[0] || '-') : '-',
          phone: jsonEvent.organizer.phone ? (jsonEvent.organizer.phone[0] || '-') : '-'
        };
      }
      if (jsonEvent.bookingInfo && jsonEvent.bookingInfo.length > 0) {
        this.price = parseFloat(jsonEvent.bookingInfo[0].price);
      }
      this.pricing = getPricing(jsonEvent);
      this.publisher = jsonEvent.publisher || '';
      this.created = new Date(jsonEvent.created);
      this.creator = jsonEvent.creator || '';
      this.type = getCategoryByType(jsonEvent, 'eventtype') || {};
      this.theme = getCategoryByType(jsonEvent, 'theme') || {};
      this.calendar = {};
      this.calendarType = jsonEvent.calendarType || '';
      this.startDate = jsonEvent.startDate;
      this.endDate = jsonEvent.endDate;
      this.url = jsonEvent.sameAs[0];
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
     * Set the calendar for this event.
     */
    setCalendar: function(calendar) {
      this.calendar = calendar;
    },

    /**
     * Get the calendar for this event.
     */
    getCalendar: function() {
      return this.calendar;
    },

    /**
     * Set the location of this event.
     */
    setLocation: function(location) {
      this.location = location;
    },

    /**
     * Get the calendar for this event.
     */
    getLocation: function() {
      return this.location;
    },

    /**
     * Tag the event with a label or a list of labels
     * @param {string|string[]} label
     */
    tag: function (label) {
      var labels = [];

      if (_.isArray(label)) {
        labels = label;
      }

      if (_.isString(label)) {
        labels = [label];
      }

      this.labels = _.union(this.labels, labels);
    },

    /**
     * Untag a label from an event
     * @param {string} labelName
     */
    untag: function (labelName) {
      _.remove(event.labels, function (label) {
        return label === labelName;
      });
    }
  };

  return (UdbEvent);
}
