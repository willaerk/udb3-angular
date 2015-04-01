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
function EventFormDataFactory(UdbEvent, UdbPlace) {
  return {

    isEvent : true, // Is current item an event.
    isPlace : false, // Is current item a place.
    showStep1 : true,
    showStep2 : false,
    showStep3 : false,
    showStep4 : false,
    showStep5 : false,
    majorInfoChanged : false,
    // Properties that will be copied to UdbEvent / UdbPlace.
    id : '',
    name : {
      nl : ''
    },
    description : {},
    location : {
      'id' : null,
      'name': '',
      'address': {
        'addressCountry': '',
        'addressLocality': '',
        'postalCode': '',
        'streetAddress': ''
      }
    },
    place : {},
    type : {},
    theme : {},
    activeCalendarType : '', // only needed for the angular.
    activeCalendarLabel : '', // only needed for the angular.
    calendarType : '',
    startDate : '',
    endDate : '',
    timestamps : [],
    openingHours : [],
    ageRange : '',
    organizer : {},
    contactPoint : {
      url : [],
      phone : [],
      email : []
    },
    facilities : [],
    bookingInfo : {},
    mediaObject : [],
    image : [],
    additionalData : {},

    /**
     * Show the given step.
     * @param {number} stepNumber
     */
    showStep: function(stepNumber) {
      this['showStep' + stepNumber] = true;
    },

    /**
     * Hide the given step.
     * @param {number} stepNumber
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
     * Set the description for a given langcode.
     */
    setDescription: function(description, langcode) {
      this.description[langcode] = description;
    },

    /**
     * Get the description for a given langcode.
     */
    getDescription: function(langcode) {
      return this.description[langcode];
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

    getStartDate : function() {
      return this.startDate;
    },

    setStartDate: function(startDate) {
      this.startDate = startDate;
    },

    getEndDate : function() {
      return this.endDate;
    },

    setEndDate: function(endDate) {
      this.endDate = endDate;
    },

    /**
     * Get the opening hours.
     */
    getOpeningHours: function() {
      return this.openingHours;
    },

    /**
     * Reset the location.
     */
    resetLocation: function(location) {
      this.location = {
        'id' : null,
        'name': '',
        'address': {
          'addressCountry': '',
          'addressLocality': '',
          'postalCode': '',
          'streetAddress': ''
        }
      };
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
     * Set the age range.
     */
    setAgeRange: function(range) {
      this.ageRange = range;
    },

    /**
     * Get the age range.
     */
    getAgeRange: function() {
      return this.ageRange;
    },

    /**
     * Add a timestamp to the timestamps array.
     */
    addTimestamp: function(date, startHour, endHour) {

      this.timestamps.push({
        'date' : date,
        'startHour' : startHour,
        'endHour' : endHour,
        'showStartHour' : startHour !== '',
        'showEndHour' : endHour !== '',
      });

    },

    /**
     * Add a timestamp to the timestamps array.
     */
    addOpeningHour: function(dayOfWeek, opens, closes) {

      this.openingHours.push({
        'daysOfWeek' : dayOfWeek,
        'opens' : opens,
        'closes' : closes,
        'label' : ''
      });

    },

    /**
     * Remove the openinghour with the given index.
     */
    removeOpeningHour: function(index) {
      this.openingHours.splice(index, 1);
    },

    /**
     * Reset the calendar.
     */
    resetCalendar: function() {
      this.openingHours = [];
      this.timestamps = [];
      this.startDate = '';
      this.endDate = '';
      this.calendarType = '';
      this.activeCalendarType = '';
    },

    /**
     * Get the type that will be saved.
     */
    getType: function() {
      return this.isEvent ? 'event' : 'place';
    },

    /**
     * Reset the selected organizers.
     */
    resetOrganizer: function() {
      this.organizer = {};
    },

    /**
     * Reset the contact point.
     */
    resetContactPoint: function() {
      this.contactPoint = {
        url : [],
        phone : [],
        email : []
      };
    },

    /**
     * Sets the booking info array.
     */
    setBookingInfo : function(bookingInfo) {
      this.bookingInfo = bookingInfo;
    },

    /**
     * Add a new media object.
     */
    addMediaObject : function(url, thumbnailUrl, description, copyrightHolder) {
      this.mediaObject.push({
        url : url,
        thumbnailUrl : thumbnailUrl,
        description : description,
        copyrightHolder : copyrightHolder
      });
    },

    /**
     * Edit a media object.
     */
    editMediaObject : function(indexToEdit, url, thumbnailUrl, description, copyrightHolder) {
      this.mediaObject[indexToEdit] = {
        url : url,
        thumbnailUrl : thumbnailUrl,
        description : description,
        copyrightHolder : copyrightHolder,
      };
    },

    /**
     * Delete a given media object.
     */
    deleteMediaObject : function(index) {
      this.mediaObject.splice(index, 1);
    }

  };
}
