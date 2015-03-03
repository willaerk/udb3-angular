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

  function getCategoryLabel(jsonEvent, domain) {
    var label;
    var category = _.find(jsonEvent.terms, function (category) {
      return category.domain === domain;
    });

    if (category) {
      label = category.label;
    }

    return label;
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
  var UdbEvent = function (jsonEvent) {
    this.parseJson(jsonEvent);
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
      this.type = getCategoryLabel(jsonEvent, 'eventtype') || '';
      this.theme = getCategoryLabel(jsonEvent, 'theme') || '';
      this.calendarType = jsonEvent.calendarType || '';
      this.startDate = jsonEvent.startDate;
      this.endDate = jsonEvent.endDate;
      this.url = jsonEvent.sameAs[0];
      if (jsonEvent.typicalAgeRange) {
        this.typicalAgeRange = jsonEvent.typicalAgeRange;
      }
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
