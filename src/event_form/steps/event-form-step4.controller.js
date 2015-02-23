(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep4Ctrl
   * @description
   * # EventFormStep4Ctrl
   * Step 4 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep4Ctrl', EventFormStep4Controller);

  /* @ngInject */
  function EventFormStep4Controller(udbApi, $scope, EventFormData) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

  }

})();
