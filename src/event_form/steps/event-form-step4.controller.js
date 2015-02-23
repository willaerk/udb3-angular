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
  function EventFormStep4Controller($scope, EventFormData, udbApi, SearchResultViewer) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

    $scope.validateEvent = validateEvent;
    $scope.activeTitle = '';
    $scope.duplicatesFound = false;
    $scope.resultViewer = new SearchResultViewer();

    /**
     * Validate date after step 4 to enter step 5.
     */
    function validateEvent() {
      // Set the name.
      EventFormData.item.setName($scope.activeTitle, 'nl');

      // Load the candidate duplicates asynchronously.
      // Duplicates are found on existing identical properties:
      // - title is the same
      // - on the same location.
      var promise = udbApi.findEvents($scope.activeTitle);

      $scope.resultViewer.loading = true;

      promise.then(function (data) {
        $scope.resultViewer.setResults(data);
      });

    }

  }

})();
