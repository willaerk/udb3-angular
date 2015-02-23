(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep3Ctrl
   * @description
   * # EventFormStep3Ctrl
   * Step 3 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep3Ctrl', EventFormStep3Controller);

  /* @ngInject */
  function EventFormStep3Controller($scope, EventFormData) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

  }

})();
