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
  function EventFormStep5Controller(udbApi, $scope, EventFormData) {

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


    if (EventFormData.minAge) {
      $scope.ageCssClass = 'state-complete';
    }

    /**
     * Save the description.
     */
    function saveDescription() {

      EventFormData.setDescription($scope.description, 'nl');

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

  }

})();
