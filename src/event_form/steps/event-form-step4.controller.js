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
    $scope.saveEvent = saveEvent;
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


      //$scope.eventFormData.selectedLocation
      //// is Event
      // http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=location_cdbid:81E9C76C-BA61-0F30-45F5CD2279ACEBFC
      // http://search-prod.lodgon.com/search/rest/detail/event/86E40542-B934-58DD-69AF85AC7FCEC934
      // http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=street:Dr.%20Mathijsenstraat
      //
      // IsPlace
      // location_contactinfo_zipcode
      //http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=zipcode:9000
      var params = {};

      if ($scope.isEvent) {
        params = { locationCdbId : '81E9C76C-BA61-0F30-45F5CD2279ACEBFC' };
      }
      else {
        params = { locationZip : '9000' };
      }

      // Load the candidate duplicates asynchronously.
      // Duplicates are found on existing identical properties:
      // - title is the same
      // - on the same location.
      var promise = udbApi.findEvents($scope.activeTitle, 0, params);

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
      if ($scope.resultViewer.events[previousDelta] !== undefined) {
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
      if ($scope.resultViewer.events[nextDelta] !== undefined) {
        var eventId = $scope.resultViewer.events[nextDelta]['@id'].split('/').pop();
        $scope.currentDuplicateId = eventId;
        $scope.currentDuplicateDelta = parseInt(nextDelta) + 1;
      }

    }

    /**
     * Save Event for the first time.
     */
    function saveEvent() {
      
      if ($scope.isEvent) {
        // Copy properties to UdbEvent
      }
      else {
        // Copy properties to UdbPlace
          
      }
    }

  }

})();
