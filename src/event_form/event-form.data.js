'use strict';

/**
 * @ngdoc service
 * @name udb.core.EventFormData
 * @description
 * Contains data needed for the steps in the event form.
 */
angular
  .module('udb.event-form')
  .factory('EventFormData', EventFormDataFactory);

/* @ngInject */
function EventFormDataFactory() {
  return {

    isEvent : true, // Is current item an event.
    isPlace : false, // Is current item a place.
    showStep1 : true,
    showStep2 : false,
    showStep3 : false,
    showStep4 : false,
    showStep5 : false,
    // Properties that will be copied to UdbEvent / UdbPlace.
    name : {},
    place : {},
    type : {},
    theme : {},
    timestamps : [],
    openingHours : [],

    // Properties that will be copied to UdbEvent / UdbPlace.
    name : {},
    place : {},
    type : {},
    theme : {},
    timestamps : [],
    openingHours : [],

    /**
     * Show the given step.
     * @param int stepNumber
     */
    showStep: function(stepNumber) {
      this['showStep' + stepNumber] = true;
    },

    /**
     * Hide the given step.
     * @param int stepNumber
     */
    hideStep: function (stepNumber) {
      this['showStep' + stepNumber] = false;
    },

    /**
     * Set the name of the offer for a given langcode.
     */
    setName: function(name, langcode) {
      this.name[langcode] = name;
    },

    /**
     * Get the name of the offer for a given langcode.
     */
    getName: function(langcode) {
      return this.name[langcode];
    },

    /**
     * Set the event type.
     */
    setEventType: function(id, label) {
      this.type = {
        'id' : id,
        'label' : label,
        'domain' : 'eventtype',
      };
    },

    /**
     * Get the event type.
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
     * Set the theme.
     */
    setTheme: function(id, label) {
      this.theme = {
        'id' : id,
        'label' : label,
        'domain' : 'thema',
      };
    },

    /**
     * Get the theme.
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
     * Get the opening hours.
     */
    getOpeningHours: function() {
      return this.openingHours;
    },

    /**
     * Set the location.
     */
    setLocation: function(location) {
      this.location = location;
    },

    /**
     * Get the calendar.
     */
    getLocation: function() {
      return this.location;
    },

    /**
     * Add a timestamp to the timestamps array.
     */
    addTimestamp: function(date, startHour, endHour) {

      this.timestamps.push({
        'date' : '',
        'startHour' : '',
        'endHour' : '',
        'showStartHour' : startHour !== '',
        'showEndHour' : endHour !== '',
      });
    },

    /**
     * Reset the calendar.
     */
    resetCalendar: function() {
      this.openingHours = [];
      this.timestamps = [];
    },

  };
}
