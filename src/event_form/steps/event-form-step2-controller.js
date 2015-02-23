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
    .controller('EventFormStep2Ctrl', EventFormStep2Controller);

  EventFormStep2Controller.$inject = ['udbApi', '$scope', '$controller', '$location', 'EventFormData', 'UdbEvent', 'UdbOpeningHours', 'UdbPlace', 'moment', 'eventCrud'];

  function EventFormStep2Controller(udbApi, $scope, $controller, $window, EventFormData, UdbEvent, UdbOpeningHours, UdbPlace, moment, eventCrud) {

    // Scope vars.
    $scope.item = EventFormData;
    $scope.showStep = showStep;
    $scope.activeCalendarType = ''; // Current active calendar type.
    $scope.activeCalendarLabel = '';
    $scope.calendarLabels = [
      { 'label': 'Eén of meerdere dagen', 'id' : 'single' },
      { 'label': 'Van ... tot ... ', 'id' : 'periodic' },
      { 'label' : 'Permanent', 'id' : 'permanent' }
    ];
    $scope.testingChange = testingChange;

    /**
     * Show the given step.
     * @param int stepNumber
     */
    function showStep(stepNumber) {
    }

    function testingChange() {
      EventFormData.item.setEventType('0.50.4.0.0', 'Concert changed');
    }

  }

})();
