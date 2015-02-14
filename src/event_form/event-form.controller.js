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

  EventFormController.$inject = ['udbApi', '$scope', '$controller', '$location', 'moment', 'eventCreator'];

  function EventFormController(udbApi, $scope, $controller, $window, moment, eventCreator) {

    $scope.showStep1 = true;
    $scope.showStep2 = false;
    $scope.showStep3 = false;
    $scope.showStep4 = false;
    $scope.showStep5 = false;
    $scope.lastUpdated = '';

    $scope.event = null; // should be empty UdbEvent.

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
      showStep(5);
      saveEvent();
    }

    /**
     * Save the event.
     */
    function saveEvent() {
      $scope.lastUpdated = moment(Date.now()).format('DD/MM/YYYY HH:mm:s');
    }

  }

})();
