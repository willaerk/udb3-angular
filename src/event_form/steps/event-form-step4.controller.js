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
function EventFormStep4Controller($scope, EventFormData, udbApi, appConfig, SearchResultViewer, eventCrud, $modal) {

  // Scope vars.
  // main storage for event form.
  $scope.eventFormData = EventFormData;

  $scope.infoMissing = false;
  $scope.duplicatesSearched = false;
  $scope.saving = false;
  $scope.error = false;
  $scope.udb3DashboardUrl = appConfig.udb3BaseUrl;
  $scope.currentDuplicateId = '';
  $scope.currentDuplicateDelta = 0;

  $scope.validateEvent = validateEvent;
  $scope.saveEvent = saveEvent;
  $scope.setActiveDuplicate = setActiveDuplicate;
  $scope.previousDuplicate = previousDuplicate;
  $scope.nextDuplicate = nextDuplicate;
  $scope.resultViewer = new SearchResultViewer();
  $scope.setMajorInfoChanged = setMajorInfoChanged;

  // Check if we need to show the leave warning
  window.onbeforeunload = function (event) {
    if (EventFormData.majorInfoChanged) {
      return 'Bent u zeker dat je de pagina wil verlaten? Gegevens die u hebt ingevoerd worden niet opgeslagen.';
    }
  };

  /**
   * Validate date after step 4 to enter step 5.
   */
  function validateEvent(checkDuplicates) {

    // First check if all data is correct.
    $scope.infoMissing = false;
    var missingInfo = [];
    if (EventFormData.calendarType === 'single' && EventFormData.timestamps[0].date === '') {
      missingInfo.push('timestamp missing');
    }
    else if (EventFormData.calendarType === 'periodic' &&
      (EventFormData.startDate === '' || EventFormData.endDate === '')
    ) {
      missingInfo.push('start or end date missing');
    }

    if (!EventFormData.type.id) {
      missingInfo.push('event type missing');
    }

    if (EventFormData.isEvent && !EventFormData.location.id) {
      missingInfo.push('place missing for event');
    }
    else if (EventFormData.isPlace && !EventFormData.location.address.streetAddress) {
      missingInfo.push('location missing for place');
    }

    if (missingInfo.length > 0) {
      $scope.infoMissing = true;
      console.log(missingInfo);
      return;
    }

    if (checkDuplicates) {
      $scope.saving = true;
      $scope.error = false;

      //// is Event
      // http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=location_cdbid:81E9C76C-BA61-0F30-45F5CD2279ACEBFC
      // http://search-prod.lodgon.com/search/rest/detail/event/86E40542-B934-58DD-69AF85AC7FCEC934
      // http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=street:Dr.%20Mathijsenstraat
      //
      // IsPlace
      // location_contactinfo_zipcode
      //http://search-prod.lodgon.com/search/rest/search?q=*&fq=type:event&fq=zipcode:9000
      var params = {};
      var location = EventFormData.getLocation();

      if (EventFormData.isEvent) {
        params = {locationCdbId : location.id};
      }
      else {
        params = {
          locationZip : location.address.postalCode,
          place : true
        };
      }

      // Load the candidate duplicates asynchronously.
      // Duplicates are found on existing identical properties:
      // - title is the same
      // - on the same location.
      var promise = udbApi.findEvents(EventFormData.name.nl, 0, params);

      $scope.resultViewer.loading = true;
      $scope.duplicatesSearched = true;

      promise.then(function (data) {

        // Set the results for the duplicates modal,
        if (data.totalItems > 0) {
          $scope.saving = false;
          $scope.resultViewer.setResults(data);
        }
        // or save the event immediataly if no duplicates were found.
        else {
          saveEvent();
        }

      }, function() {
        // Error while saving.
        $scope.error = true;
        $scope.saving = false;
      });
    }
    else {
      saveEvent();
    }

  }

  /**
   * Save Event for the first time.
   */
  function saveEvent() {

    $scope.error = false;
    $scope.saving = true;

    var eventCrudPromise;
    if (EventFormData.id) {
      eventCrudPromise = eventCrud.updateMajorInfo(EventFormData);
    }
    else {
      eventCrudPromise = eventCrud.createEvent(EventFormData);
    }

    eventCrudPromise.then(function(jsonResponse) {

      EventFormData.majorInfoChanged = false;

      if (EventFormData.isEvent && jsonResponse.data.eventId) {
        EventFormData.id = jsonResponse.data.eventId;
      }
      else if (jsonResponse.data.placeId) {
        EventFormData.id = jsonResponse.data.placeId;
      }

      updateLastUpdated();
      $scope.saving = false;
      $scope.resultViewer = new SearchResultViewer();
      EventFormData.showStep(5);

    }, function() {
      // Error while saving.
      $scope.error = true;
      $scope.saving = false;
    });

  }

  /**
   * Update the last updated time.
   */
  function updateLastUpdated() {
    // Last updated is not in scope. Themers are free to choose where to place it.
    angular.element('#last-updated').show();
    angular.element('#last-updated span').html(moment(Date.now()).format('HH:mm'));
  }

  /**
   * Set a focus to a duplicate
   * @param {type} id
   */
  function setActiveDuplicate(id) {

    for (var duplicateId in $scope.resultViewer.events) {
      var eventId = $scope.resultViewer.events[duplicateId]['@id'].split('/').pop();
      if (eventId === id) {
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
   * Mark the major info as changed.
   */
  function setMajorInfoChanged() {
    if (EventFormData.id) {
      EventFormData.majorInfoChanged = true;
    }
  }

}
