(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep2Ctrl
   * @description
   * # EventFormStep2Ctrl
   * Step 2 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep2Ctrl', EventFormStep2Controller);

  /* @ngInject */
  function EventFormStep2Controller($scope, EventFormData, UdbOpeningHours) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

    $scope.activeCalendarType = ''; // Current active calendar type.
    $scope.activeCalendarLabel = '';
    $scope.calendarLabels = [
      { 'label': 'Eén of meerdere dagen', 'id' : 'single' },
      { 'label': 'Van ... tot ... ', 'id' : 'periodic' },
      { 'label' : 'Permanent', 'id' : 'permanent' }
    ];

  }

})();
