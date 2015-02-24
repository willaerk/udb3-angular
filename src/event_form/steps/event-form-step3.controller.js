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
    $scope.eventFormData.selectedCity = "";
    $scope.eventFormData.selectedLocation = "";
    $scope.citySelected = false;
    $scope.locationSelected = false;
    $scope.selectCity = selectCity;
    $scope.selectLocation = selectLocation;
    $scope.changeCitySelection = changeCitySelection;
    getCities();
    getLocationsForCity();

    function getCities(){
      $scope.cities = ['9000 Gent', '2000 Antwerpen'];
    }

    function getLocationsForCity() {
      $scope.locationsForCity = ['Locatie1', 'Locatie2'];
    }

    function selectCity() {
      $scope.citySelected = true;
    }

    function changeCitySelection() {
      $scope.eventFormData.selectedCity = "";
      $scope.citySelected = false;
    }

    function selectLocation() {
      $scope.locationSelected = true;
    }

    function changeLocationSelection() {
      $scope.eventFormData.selectedLocation = "";
      $scope.locationSelected = false;
    }
  }

})();
