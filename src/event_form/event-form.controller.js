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
function EventFormController($scope, eventId, offerType, EventFormData, udbApi) {

  // Other controllers won't load untill this boolean is set to true.
  $scope.loaded = false;

  // Fill the event form data if an event is beïng edited.
  if (eventId) {

    if (offerType === 'event') {
      udbApi.getEventById(eventId).then(function(event) {
        EventFormData.isEvent = true;
        EventFormData.isPlace = false;
        copyItemDataToFormData(event);
      });
    }
    else if (offerType === 'place') {
      udbApi.getPlaceById(eventId).then(function(place) {
        EventFormData.isEvent = false;
        EventFormData.isPlace = true;
        copyItemDataToFormData(place);
      });
    }

  }
  else {
    $scope.loaded = true;
  }

  /**
   * Copy all item data to form data so it can be used for edting.
   * var {UdbEvent|UdbPlace} item
   */
  function copyItemDataToFormData(item) {

    console.log(item);
    // Properties that exactly match.
    var sameProperties = [
      'id',
      'name',
      'type',
      'theme',
      'openingHours',
      'description',
      'typicalAgeRange',
      'organizer',
      'bookingInfo',
      'contactPoint',
      'mediaObject'
    ];
    for (var i = 0; i < sameProperties.length; i++) {
      if (item[sameProperties[i]]) {
        EventFormData[sameProperties[i]] = item[sameProperties[i]];
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
    if (EventFormData.calendarType === 'single' && item.subEvent) {
      for (var j = 0; j < item.subEvent.length; j++) {
        var subEvent = item.subEvent[j];
        var startDate = new Date(subEvent.startDate);
        var endDate = new Date(subEvent.endDate);
        var startHour = startDate.getHours() + ':' + startDate.getMinutes();
        var endHour = endDate.getHours() + ':' + endDate.getMinutes();
        EventFormData.addTimestamp(startDate, startHour === '00:00' ? '' : endHour === '00:00' ? '' : endHour);
      }
    }

    // Copy location.
    if (item.location && item.location['@id']) {
      EventFormData.location = {
        id : item.location['@id'].split('/').pop(),
        name : item.location.name,
        address : item.location.address
      };
    }

    $scope.loaded = true;
    EventFormData.showStep(1);
    EventFormData.showStep(2);
    EventFormData.showStep(3);
    EventFormData.showStep(4);
    EventFormData.showStep(5);

    console.log(EventFormData);

  }

}
