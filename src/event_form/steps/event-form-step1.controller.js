(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep1Ctrl
   * @description
   * # EventFormStep1Ctrl
   * Step 1 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep1Ctrl', EventFormStep1Controller);

  /* @ngInject */
  function EventFormStep1Controller($scope, EventFormData, UdbEvent, UdbPlace, eventTypes) {

    // main storage for event form.
    $scope.eventFormData = EventFormData;

    // Categories, event types, places.
    $scope.eventTypeLabels = [];
    $scope.placeLabels = [];
    $scope.activeEventType = ''; // Current active event type.
    $scope.activeEventTypeLabel = ''; // Current active event type label.
    // Load the categories asynchronously.
    var eventPromise = eventTypes.getCategories();
    eventPromise.then(function (categories) {
      $scope.eventTypeLabels = categories.event;
      $scope.placeLabels = categories.place;
    });

    $scope.showAllEventTypes = false;
    $scope.showAllPlaces = false;
    $scope.eventThemeLabels = [];
    $scope.activeTheme = '';
    $scope.activeThemeLabel = '';

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
    function setEventType(type, isEvent) {

      $scope.activeEventType = type;

      if (isEvent) {
        EventFormData.isEvent = true;
        EventFormData.isPlace = false;

        for (var i = 0; i < $scope.eventTypeLabels.length; i++) {
          if ($scope.eventTypeLabels[i].id === type) {
            $scope.activeEventType = $scope.eventTypeLabels[i].id;
            $scope.activeEventTypeLabel = $scope.eventTypeLabels[i].label;

            $scope.eventThemeLabels = $scope.eventTypeLabels[i].themes;
            break;
          }
        }

      }
      else {
        EventFormData.isEvent = false;
        EventFormData.isPlace = true;

        for (var j = 0; j < $scope.placeLabels.length; j++) {
          if ($scope.placeLabels[j].id === type) {
            $scope.activeEventType = $scope.placeLabels[j].id;
            $scope.activeEventTypeLabel = $scope.placeLabels[j].label;
            break;
          }
        }

      }

      // Check if previous event type was the same.
      // If so, just show the previous entered data.
      if (EventFormData.eventType === type) {
        return;
      }

      EventFormData.eventType = type;

    }

    /**
     * Click listener to reset the event type. User can select a new event type.
     */
    function resetEventType() {
      $scope.activeEventType = '';
      $scope.activeEventTypeLabel = '';
      $scope.activeTheme = '';
      $scope.activeThemeLabel = '';
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

    }

    /**
     * Click listener to reset the active theme.
     */
    function resetTheme() {
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

})();