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
    .controller('EventFormStep1Ctrl', EventFormStep1Controller);

  EventFormStep1Controller.$inject = ['udbApi', '$scope', '$controller', '$location', 'EventFormData', 'UdbEvent', 'UdbOpeningHours', 'UdbPlace', 'moment', 'eventCrud'];

  function EventFormStep1Controller(udbApi, $scope, $controller, $window, EventFormData, UdbEvent, UdbOpeningHours, UdbPlace, moment, eventCrud) {

    var item;
    console.log(EventFormData);

    // Hardcoded as UdbEvent for poc.
    EventFormData.item = new UdbEvent();
    EventFormData.item.setName('my name', 'nl');
    EventFormData.item.setEventType('0.50.4.0.0', 'Concert');
    EventFormData.item.setTheme('1.8.3.5.0', 'Amusementsmuziek');

    var location = new UdbPlace();
    location.setLocality('Gent');
    location.setPostal(9000);
    EventFormData.item.setLocation(location);

    // Scope vars.
    $scope.showStep1 = true;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
    $scope.showStep4 = false;
    $scope.showStep5 = false;
    $scope.lastUpdated = '';
    $scope.item = item;
    $scope.EventFormData = EventFormData;
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
