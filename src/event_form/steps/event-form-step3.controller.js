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
    $scope.eventFormData.selectedCity = '';
    $scope.eventFormData.selectedLocation = '';
    $scope.eventFormData.placeStreet = '';
    $scope.eventFormData.placeNumber = '';
    $scope.eventFormData.place = '';

    // storage for step 3
    $scope.cities = [];
    $scope.locationsForCity = [];
    $scope.citySelected = false;
    $scope.locationSelected = false;
    $scope.addLocation = false;
    $scope.placeValidated = false;

    // Get cities and locations.
    getCities();
    getLocationsForCity();

    // define functions
    $scope.selectCity = selectCity;
    $scope.selectLocation = selectLocation;
    $scope.changeCitySelection = changeCitySelection;
    $scope.changeLocationSelection = changeLocationSelection;
    $scope.validatePlace = validatePlace;
    $scope.changePlace = changePlace;


    // Functions for cities.
    function getCities(){
      $scope.cities = ['9000 Gent', '2000 Antwerpen'];
    }

    function changeCitySelection() {
      $scope.eventFormData.selectedCity = '';
      $scope.citySelected = false;
    }

    function selectCity() {
      $scope.citySelected = true;
      $scope.eventFormData.place = '';
      $scope.placeValidated = false;
    }

    // Functions for locations (in case of event)
    function getLocationsForCity() {
      $scope.locationsForCity = [];
    }

    function selectLocation() {
      if ($scope.locationsForCity.length > 0) {
        $scope.locationSelected = true;
      }
      else {
        $scope.locationSelected = false;
        $scope.addLocation = true;
      }
    }

    function changeLocationSelection() {
      $scope.eventFormData.selectedLocation = '';
      $scope.locationSelected = false;
    }

    // Functions for places (in case of place)
    function validatePlace() {
      $scope.eventFormData.place = $scope.eventFormData.placeStreet + ' ' + $scope.eventFormData.placeNumber;
      $scope.placeValidated = true;
      $scope.eventFormData.showStep4 = true;
    }

    function changePlace() {
      $scope.placeValidated = false;
      $scope.eventFormData.showStep4 = false;
    }
  }

})();
