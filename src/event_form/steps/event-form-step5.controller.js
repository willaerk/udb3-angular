(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep5Ctrl
   * @description
   * # EventFormStep5Ctrl
   * Step 5 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep5Ctrl', EventFormStep5Controller);

  /* @ngInject */
  function EventFormStep5Controller($scope, EventFormData, eventCrud) {

    // Work hardcoded on this id for now.
    EventFormData.id = '1c4a7e6a-3ed9-450f-80d7-e3439cb72e15';

    // Scope vars.
    $scope.eventFormData = EventFormData; // main storage for event form.
    $scope.description = EventFormData.getDescription('nl');
    $scope.descriptionCssClass = $scope.description ? 'state-complete' : 'state-incomplete';
    $scope.ageRange = 0;
    $scope.ageCssClass = EventFormData.ageRange ? 'state-complete' : 'state-incomplete';
    $scope.minAge = '';

    // Scope functions.
    $scope.saveDescription = saveDescription;
    $scope.saveAgeRange = saveAgeRange;
    $scope.changeAgeRange = changeAgeRange;
    $scope.setAllAges = setAllAges;
    $scope.resetAgeRange = resetAgeRange;

    // Check if we have a minAge set on load.
    if (EventFormData.minAge) {
      $scope.ageCssClass = 'state-complete';
    }

    /**
     * Save the description.
     */
    function saveDescription() {

      EventFormData.setDescription($scope.description, 'nl');

      var promise = eventCrud.updateDescription(EventFormData, EventFormData.getType(), $scope.description);
      promise.then(function() {
        updateLastUpdated();
      });

      // Toggle correct class.
      if ($scope.description) {
        $scope.descriptionCssClass = 'state-complete';
      }
      else {
        $scope.descriptionCssClass = 'state-incomplete';
      }

    }

    /**
     * Listener on the age range selection.
     */
    function changeAgeRange() {

      $scope.ageRange = parseInt($scope.ageRange);

      if ($scope.ageRange > 0) {
        $scope.ageCssClass = 'state-complete';
      }
      else {
        setAllAges();
      }

    }

    /**
     * Save the age range.
     */
    function saveAgeRange() {

      if ($scope.ageRange > 0) {

        if ($scope.ageRange === 12 || $scope.ageRange === 18) {
          EventFormData.typicalAgeRange = $scope.minAge + '-' + $scope.ageRange;
        }
        else {
          EventFormData.typicalAgeRange = $scope.ageRange + '-';
        }

      }
      else {
        EventFormData.typicalAgeRange = $scope.ageRange;
      }

      var promise = eventCrud.updateTypicalAgeRange(EventFormData, EventFormData.getType());
      promise.then(function() {
        updateLastUpdated();
      });

      $scope.ageCssClass = 'state-complete';
    }

    /**
     * Set to all ages.
     */
    function setAllAges() {
      $scope.ageRange = -1;
      EventFormData.setAgeRange(-1);
      $scope.ageCssClass = 'state-complete';
    }

    /**
     * Reset the age selection.
     */
    function resetAgeRange() {
      $scope.ageRange = 0;
      $scope.minAge = '';
      $scope.ageCssClass = 'state-incomplete';
    }

    /**
     * Update the last updated time.
     */
    function updateLastUpdated() {
      // Last updated is not in scope. Themers are free to choose where to place it.
      angular.element('#last-updated').show();
      angular.element('#last-updated span').html(moment(Date.now()).format('HH:mm'));
    }

  }

})();
