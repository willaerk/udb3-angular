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
  function EventFormStep4Controller($scope, EventFormData, udbApi, appConfig, SearchResultViewer, $modal) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

    $scope.validateEvent = validateEvent;
    $scope.duplicatesSearched = false;
    $scope.udb3DashboardUrl = appConfig.udb3DashboardUrl;
    $scope.activeTitle = '';
    $scope.currentDuplicateId = '';
    $scope.currentDuplicateDelta = 0;
    //$scope.event = new UdbEvent();
    $scope.setActiveDuplicate = setActiveDuplicate;
    $scope.previousDuplicate = previousDuplicate;
    $scope.nextDuplicate = nextDuplicate;
    $scope.resultViewer = new SearchResultViewer();

    /**
     * Validate date after step 4 to enter step 5.
     */
    function validateEvent() {
      // Set the name.
      EventFormData.setName($scope.activeTitle, 'nl');

      // Load the candidate duplicates asynchronously.
      // Duplicates are found on existing identical properties:
      // - title is the same
      // - on the same location.
      var promise = udbApi.findEvents($scope.activeTitle);

      $scope.resultViewer.loading = true;
      $scope.duplicatesSearched = true;

      promise.then(function (data) {
        $scope.resultViewer.setResults(data);
      });

    }

    /**
     * Set a focus to a duplicate
     * @param {type} id
     */
    function setActiveDuplicate(id) {

      for (var duplicateId in $scope.resultViewer.events) {
        var eventId = $scope.resultViewer.events[duplicateId]['@id'].split('/').pop();
        if (eventId === id) {
          console.log('found ' + id);
          $scope.currentDuplicateId = id;
          $scope.currentDuplicateDelta = parseInt(duplicateId) + 1;
        }
      }

    }

    /**
     * Set the previous duplicate active or close modal.
     */
    function previousDuplicate() {

      var previousDelta = parseInt($scope.currentDuplicateDelta) - 2;
      if ($scope.resultViewer.events[previousDelta] === undefined) {
        angular.element('#dubbeldetectie-voorbeeld').modal('hide');
      }
      else {
        var eventId = $scope.resultViewer.events[previousDelta]['@id'].split('/').pop();
        $scope.currentDuplicateId = eventId;
        $scope.currentDuplicateDelta = parseInt(previousDelta) + 1;
      }

    }

    /**
     * Set the next duplicate active or close modal.
     */
    function nextDuplicate() {

      var nextDelta = parseInt($scope.currentDuplicateDelta);
      if ($scope.resultViewer.events[nextDelta] === undefined) {
        angular.element('#dubbeldetectie-voorbeeld').modal('hide');
      }
      else {
        var eventId = $scope.resultViewer.events[nextDelta]['@id'].split('/').pop();
        $scope.currentDuplicateId = eventId;
        $scope.currentDuplicateDelta = parseInt(nextDelta) + 1;
      }

    }

  }

})();
