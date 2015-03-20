'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormCtrl
 * @description
 * # EventFormCtrl
 * Init the event form
 */
angular
  .module('udb.event-form')
  .controller('EventFormCtrl', EventFormController);

/* @ngInject */
function EventFormController($scope, eventId, placeId, offerType, EventFormData, udbApi) {

  // Other controllers won't load untill this boolean is set to true.
  $scope.loaded = false;

  // Fill the event form data if an event is beïng edited.
  if (eventId) {

    if (offerType === 'event') {
      udbApi.getEventById(eventId).then(function(event) {
        EventFormData.isEvent = true;
        EventFormData.isPlace = false;
        copyItemDataToFormData(event);

        // Copy location.
        if (event.location && event.location['@id']) {
          EventFormData.location = {
            id : event.location['@id'].split('/').pop(),
            name : event.location.name,
            address : event.location.address
          };
        }
      });
    }
  }
  else if (placeId) {

    udbApi.getPlaceById(placeId).then(function(place) {

      EventFormData.isEvent = false;
      EventFormData.isPlace = true;
      copyItemDataToFormData(place);

      // Places only have an address, form uses location property.
      if (place.address) {
        EventFormData.location = {
          address : place.address
        };
      }

    });

  }
  else {
    $scope.loaded = true;
  }

  /**
   * Copy all item data to form data so it can be used for edting.
   * var {UdbEvent|UdbPlace} item
   */
  function copyItemDataToFormData(item) {

    // Properties that exactly match.
    var sameProperties = [
      'id',
      'type',
      'theme',
      'openingHours',
      'description',
      'typicalAgeRange',
      'organizer',
      'bookingInfo',
      'contactPoint',
      'facilities',
      'mediaObject',
      'additionalData'
    ];
    for (var i = 0; i < sameProperties.length; i++) {
      if (item[sameProperties[i]]) {
        EventFormData[sameProperties[i]] = item[sameProperties[i]];
      }
    }

    // Places don't have nl.
    if (item.name) {
      if (typeof item.name === 'object') {
        EventFormData.name = item.name;
      }
      else {
        EventFormData.setName(item.name, 'nl');
      }
    }

    EventFormData.calendarType = item.calendarType === 'multiple' ? 'single' : item.calendarType;

    // Set correct date object for start and end.
    if (item.startDate) {
      EventFormData.startDate = new Date(item.startDate);
    }

    if (item.endDate) {
      EventFormData.endDate = new Date(item.endDate);
    }

    // SubEvents are timestamps.
    if (item.calendarType === 'multiple' && item.subEvent) {
      for (var j = 0; j < item.subEvent.length; j++) {
        var subEvent = item.subEvent[j];
        addTimestamp(subEvent.startDate, subEvent.endDate);
      }
    }
    else if (item.calendarType === 'single') {
      addTimestamp(item.startDate, item.endDate);
    }

    $scope.loaded = true;
    EventFormData.showStep(1);
    EventFormData.showStep(2);
    EventFormData.showStep(3);
    EventFormData.showStep(4);
    EventFormData.showStep(5);

  }

  /**
   * Add a timestamp based on a given start and enddate.
   */
  function addTimestamp(startDateString, endDateString) {

    var startDate = new Date(startDateString);
    var endDate = new Date(endDateString);

    var startHour = '';
    startHour = startDate.getHours() < 9 ? '0' + startDate.getHours() : startDate.getHours();
    if (startDate.getMinutes() < 9) {
      startHour += ':0' + startDate.getMinutes();
    }
    else {
      startHour += ':' + startDate.getMinutes();
    }

    var endHour = '';
    endHour = endDate.getHours() < 9 ? '0' + endDate.getHours() : endDate.getHours();
    if (endDate.getMinutes() < 9) {
      endHour += ':0' + endDate.getMinutes();
    }
    else {
      endHour += ':' + endDate.getMinutes();
    }

    startHour = startHour === '00:00' ? '' : startHour;
    endHour = startHour === '00:00' ? '' : endHour;
    EventFormData.addTimestamp(startDate, startHour, endHour);

  }

}
