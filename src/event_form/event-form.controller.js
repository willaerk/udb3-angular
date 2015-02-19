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

  EventFormController.$inject = ['udbApi', '$scope', '$controller', '$location', 'UdbEvent', 'UdbTimestamps', 'UdbPlace', 'moment', 'eventCrud'];

  function EventFormController(udbApi, $scope, $controller, $window, UdbEvent, UdbTimestamps, UdbPlace, moment, eventCrud) {

    var event = new UdbEvent();

    // Hardcoded for poc.
    event.setName('my name', 'nl');
    event.setEventType('0.50.4.0.0', 'Concert');
    event.setTheme('1.8.3.5.0', 'Amusementsmuziek');

    var calendar = new UdbTimestamps();
    calendar.addTimestamp('06/06/15', '12:00', '13:00');
    calendar.addTimestamp('07/06/15', '12:00', '13:00');
    calendar.addTimestamp('08/06/15', '12:00', '13:00');
    event.setCalendar(calendar);

    var location = new UdbPlace();
    location.setLocality('Gent');
    location.setPostal(9000);
    event.setLocation(location);

    $scope.showStep1 = true;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
    $scope.showStep4 = false;
    $scope.showStep5 = false;
    $scope.lastUpdated = '';
    $scope.type = 'event';
    $scope.event = event; // should be empty UdbEvent.

    $scope.showStep = showStep;
    $scope.saveEvent = saveEvent;
    $scope.validateEvent = validateEvent;

    /**
     * Show the given step.
     * @param int stepNumber
     */
    function showStep(stepNumber) {
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
     * Validate the event.
     */
    function validateEvent() {
      event.location.address.addressLocality = 'test';
      showStep(5);
      saveEvent();
    }

    /**
     * Save the event.
     */
    function saveEvent() {

      eventCrud.createEvent(event);

      $scope.lastUpdated = moment(Date.now()).format('DD/MM/YYYY HH:mm:s');
    }

  }

})();
