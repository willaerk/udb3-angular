'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormStep1Controller
 * @description
 * # EventFormStep1Controller
 * Step 1 of the event form
 */
angular
  .module('udb.event-form')
  .controller('EventFormStep1Controller', EventFormStep1Controller);

/* @ngInject */
function EventFormStep1Controller($scope, EventFormData, eventCategories, placeCategories) {

  // main storage for event form.
  $scope.eventFormData = EventFormData;

  // Categories, event types, places.
  $scope.eventTypeLabels = eventCategories;
  $scope.placeLabels = placeCategories;

  $scope.showEventSelection = EventFormData.id ? false : true;
  $scope.showPlaceSelection = EventFormData.id ? false : true;
  $scope.eventSelectionClass = $scope.showPlaceSelection ? 'col-xs-5' : 'col-xs-12';
  $scope.placeSelectionClass = $scope.showEventSelection ? 'col-xs-6' : 'col-xs-12';

  $scope.canRefine = false;
  $scope.showAllEventTypes = false;
  $scope.showAllPlaces = false;
  $scope.eventThemeLabels = [];

  $scope.activeEventType = EventFormData.type.id ? EventFormData.type.id : ''; // Current active event type.
  $scope.activeEventTypeLabel = EventFormData.type.label ? EventFormData.type.label : ''; // Current active event type label
  $scope.activeTheme = EventFormData.theme.id ? EventFormData.theme.id : '';
  $scope.activeThemeLabel = EventFormData.theme.label ? EventFormData.theme.label : '';

  $scope.setEventType = setEventType;
  $scope.resetEventType = resetEventType;
  $scope.toggleEventTypes = toggleEventTypes;
  $scope.togglePlaces = togglePlaces;
  $scope.setTheme = setTheme;
  $scope.resetTheme = resetTheme;

  /**
   * Click listener on the event type buttons.
   * Activate the selected event type.
   */
  function setEventType(type, label, isEvent) {

    $scope.activeEventType = type;
    $scope.showEventSelection = false;
    $scope.showPlaceSelection = false;
    var eventTypes;

    // User selected an event.
    if (isEvent) {
      EventFormData.isEvent = true;
      EventFormData.isPlace = false;

      eventTypes = $scope.eventTypeLabels;
    }
    // User selected a place.
    else {

      // Reset calendar if user switched to permanent.
      if (EventFormData.calendarType !== 'permanent') {
        EventFormData.resetCalendar();
      }

      EventFormData.isEvent = false;
      EventFormData.isPlace = true;

      eventTypes = $scope.placeLabels;

      // Places are default permanent. Users should not see a selection.
      EventFormData.calendarType = 'permanent';
      EventFormData.activeCalendarType = 'permanent';
      EventFormData.activeCalendarLabel = 'Permanent';
      if (EventFormData.openingHours.length === 0) {
        EventFormData.addOpeningHour('', '', '');
      }
      EventFormData.showStep(3);

    }

    var eventType = _.findWhere(eventTypes, {id: type});
    if (eventType) {
      $scope.activeEventType = eventType.id;
      $scope.activeEventTypeLabel = eventType.label;

      $scope.canRefine = !_.isEmpty(eventType.themes);

      if ($scope.canRefine) {
        $scope.eventThemeLabels = eventType.themes;
      }
    }

    // Check if previous event type was the same.
    // If so, just show the previous entered data.
    if (EventFormData.eventType === type) {
      return;
    }

    EventFormData.eventType = type;
    EventFormData.setEventType(type, label);
    EventFormData.theme = {};

    // Keep track of changes.
    if (EventFormData.id) {
      EventFormData.majorInfoChanged = true;
    }

    $scope.showEventSelection = false;
    $scope.showPlaceSelection = false;

    EventFormData.showStep(2);

  }

  /**
   * Click listener to reset the event type. User can select a new event type.
   */
  function resetEventType() {

    $scope.canRefine = false;
    $scope.activeEventType = '';
    $scope.activeEventTypeLabel = '';
    $scope.activeTheme = '';
    $scope.activeThemeLabel = '';

    if (EventFormData.id) {
      $scope.showEventSelection = EventFormData.id && EventFormData.isEvent ? true : false;
      $scope.showPlaceSelection = EventFormData.id && EventFormData.isPlace ? true : false;
      $scope.eventSelectionClass = 'col-xs-12';
      $scope.placeSelectionClass = 'col-xs-12';
    }
    else {
      $scope.showEventSelection = true;
      $scope.showPlaceSelection = true;
    }

  }

  /**
   * Click listener to set the active theme.
   * @param {string} id
   * @param {string} label
   */
  function setTheme(id, label) {

    $scope.activeTheme = id;

    for (var i = 0; i < $scope.eventThemeLabels.length; i++) {
      if ($scope.eventThemeLabels[i].id === id) {
        $scope.activeThemeLabel = $scope.eventThemeLabels[i].label;
        break;
      }
    }

    // Check if previous event theme was the same.
    // If so, just show the previous entered data.
    if (EventFormData.theme === id) {
      return;
    }

    EventFormData.setTheme(id, label);

    EventFormData.showStep(2);
    $scope.canRefine = false;

    if (EventFormData.id) {
      EventFormData.majorInfoChanged = true;
    }

  }

  /**
   * Click listener to reset the active theme.
   */
  function resetTheme() {
    $scope.canRefine = true;
    $scope.activeTheme = '';
  }

  /**
   * Click listener to toggle the event types list.
   */
  function toggleEventTypes() {
    $scope.showAllEventTypes = !$scope.showAllEventTypes;
  }

  /**
   * Click listener to toggle th places list.
   */
  function togglePlaces() {
    $scope.showAllPlaces = !$scope.showAllPlaces;
  }

}
