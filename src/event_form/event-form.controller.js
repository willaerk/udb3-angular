(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:NewEventCtrl
   * @description
   * # NewEventCtrl
   * udbApp controller
   */
  angular
    .module('udb.event-form')
    .controller('EventFormCtrl', EventFormController);

  //EventFormController.$inject = ['udbApi', '$scope', '$controller', '$location', 'UdbEvent', 'UdbOpeningHours', 'UdbPlace', 'moment', 'eventCrud', 'eventTypes'];
  /* @ngInject */
  function EventFormController(udbApi, $scope, $controller, $window, UdbEvent, UdbOpeningHours, UdbPlace, moment,
                               eventCrud, eventTypes, SearchResultViewer) {

    // Hardcoded as UdbEvent for poc.
    // Scope vars.
    $scope.showStep1 = true;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
    $scope.showStep4 = false;
    $scope.showStep5 = false;
    $scope.lastUpdated = '';

    var item = new UdbEvent();

    // Step 1: Choose event type and theme or a place.
    setScopeForStep1();

    // Step 4: Set the title for the event.
    setScopeForStep4();

    var location = new UdbPlace();
    location.setLocality('Gent');
    location.setPostal(9000);
    item.setLocation(location);

    $scope.item = item;

    $scope.isEvent = true; // Is current item an event.
    $scope.isPlace = false; // Is current item a place.

    $scope.activeCalendarType = ''; // Current active calendar type.
    $scope.activeCalendarLabel = '';
    $scope.calendarLabels = [
      { 'label': 'Eén of meerdere dagen', 'id' : 'single' },
      { 'label': 'Van ... tot ... ', 'id' : 'periodic' },
      { 'label' : 'Permanent', 'id' : 'permanent' }
    ];

    // Scope functions.
    $scope.showStep = showStep;
    $scope.setCalendarType = setCalendarType;
    $scope.saveItem = saveItem;
    $scope.validateItem = validateItem;

    /**
     * Show the given step.
     * @param int stepNumber
     */
    function showStep(stepNumber) {
      if ($scope.isEvent) {
        $scope.isPlace = true;
        $scope.isEvent = false;
      }
      else {
        $scope.isEvent = true;
        $scope.isPlace = false;
      }
      $scope['showStep' + stepNumber] = true;
    }

    /**
     * Hide the given step.
     * @param int stepNumber
     */
    function hideStep(stepNumber) {
      $scope['showStep' + stepNumber] = false;
    }

    /**
     * Extend the scope with the variables for step 1.
     */
    function setScopeForStep1() {

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
      $scope.setEventType = setEventType;
      $scope.resetEventType = resetEventType;
      $scope.toggleEventTypes = toggleEventTypes;
      $scope.showAllEventTypes = false;
      $scope.togglePlaces = togglePlaces;
      $scope.showAllPlaces = false;
      $scope.eventThemeLabels = [];
      $scope.activeTheme = '';
      $scope.activeThemeLabel = '';
      $scope.setTheme = setTheme;
      $scope.resetTheme = resetTheme;

    }

    /**
     * Click listener on the event type buttons.
     * Activate the selected event type.
     */
    function setEventType(type, isEvent) {

      $scope.activeEventType = type;

      if (isEvent) {
        $scope.isEvent = true;
        $scope.isPlace = false;

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
        $scope.isEvent = false;
        $scope.isPlace = true;

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
      if (item.eventType === type) {
        return;
      }

      item.eventType = type;

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
      if (item.theme === id) {
        return;
      }

      item.setTheme(id, label);

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

    /**
     *
     * @param {type} type
     * @returns {undefined}Set the scope variables for step 4: the title.
     */
    function setScopeForStep4() {
      $scope.validateEvent = validateEvent;
      $scope.activeTitle = '';
      $scope.duplicatesFound = false;
      $scope.resultViewer = new SearchResultViewer();
    }

    /**
     * Validate date after step 4 to enter step 5.
     */
    function validateEvent() {
      // Set the name.
      item.setName($scope.activeTitle, 'nl');

      // Load the candidate duplicates asynchronously.
      // Duplicates are found on existing identical properties:
      // - title is the same
      // - on the same location.
      var promise = udbApi.findEvents($scope.activeTitle, 0, '03/05/2015');

      $scope.resultViewer.loading = true;

      promise.then(function (data) {
        $scope.resultViewer.setResults(data);
      });

    }

    /**
     * Click listener on the calendar type buttons.
     * Activate the selected calendar type.
     */
    function setCalendarType(type) {

      $scope.activeCalendarType = type;

      for (var i = 0; i < $scope.calendarLabels.length; i++) {
        if ($scope.calendarLabels[i].id === type) {
          $scope.activeCalendarLabel = $scope.calendarLabels[i].label;
          break;
        }
      }

      // Check if previous calendar type was the same.
      // If so, we don't need to create new openinghours. Just show the previous entered data.
      if (item.calendarType === type) {
        return;
      }

      // A type is choosen, start a complet new calendar, removing old data.

      item.calendarType = type;
      item.resetOpeningHours();

      if (type === 'single') {
        addSingleDate();
      }

    }

    /**
     * Click listener to reset the calendar. User can select a new calendar type.
     */
    function resetCalendar() {
      $scope.activeCalendarType = '';
    }

    /**
     * Add a single date to the item.
     */
    function addSingleDate() {
      item.openingHours.push(new UdbOpeningHours());
      console.log(item.openingHours);
    }

    /**
     * Validate the event / place.
     */
    function validateItem() {
      showStep(5);
      saveItem();
    }

    /**
     * Save the event / place.
     */
    function saveItem() {

      if ($scope.isEvent) {
        eventCrud.createEvent(item);
      }

      $scope.lastUpdated = moment(Date.now()).format('DD/MM/YYYY HH:mm:s');
    }

  }

})();