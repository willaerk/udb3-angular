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
  function EventFormStep3Controller($scope, EventFormData, cityAutocomplete) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;
    $scope.eventFormData.selectedCity = '';
    $scope.eventFormData.selectedLocation = '';
    $scope.eventFormData.locationTitle = '';
    $scope.eventFormData.locationCategory = '';
    $scope.eventFormData.locationStreet = '';
    $scope.eventFormData.locationNumber = '';
    $scope.eventFormData.locationCity = '';
    $scope.eventFormData.placeStreet = '';
    $scope.eventFormData.placeNumber = '';
    $scope.eventFormData.place = '';

    // storage for step 3
    $scope.cities = [];
    $scope.locationsForCity = [];
    $scope.citySelected = false;
    $scope.locationSelected = false;
    $scope.locationAdded = false;
    $scope.newLocation = false;
    $scope.locationTitleRequired = false;
    $scope.locationStreetRequired = false;
    $scope.locationNumberRequired = false;
    $scope.placeValidated = false;
    $scope.placeStreetRequired = false;
    $scope.placeNumberRequired = false;
    $scope.cityAutocomplete = cityAutocomplete;

    getLocationCategories();

    // define functions
    $scope.selectCity = selectCity;
    $scope.selectLocation = selectLocation;
    $scope.changeCitySelection = changeCitySelection;
    $scope.changeLocationSelection = changeLocationSelection;
    $scope.addLocation = addLocation;
    $scope.resetAddLocation = resetAddLocation;
    $scope.validatePlace = validatePlace;
    $scope.changePlace = changePlace;

    // Functions for cities.
    function selectCity() {
      $scope.citySelected = true;
      $scope.eventFormData.place = '';
      $scope.placeValidated = false;
    }

    function changeCitySelection() {
      $scope.eventFormData.selectedCity = '';
      $scope.citySelected = false;
    }

    // Functions for locations (in case of event)
    function selectLocation($item, $model, $label) {
      $scope.locationSelected = true;
      $scope.newLocation = true;
    }

    function changeLocationSelection() {
      $scope.eventFormData.selectedLocation = '';
      $scope.locationSelected = false;
      if ($scope.locationAdded) {
        $scope.newLocation = true;
        $scope.eventFormData.showStep4 = false;
      }
      else {
        $scope.newLocation = false;
      }
    }

    function addLocation() {
      if (!$scope.eventFormData.locationTitle) {
        $scope.locationTitleRequired = true;
      }
      else if (!$scope.eventFormData.locationStreet) {
        $scope.locationStreetRequired = true;
      }
      else if (!$scope.eventFormData.locationNumber) {
        $scope.locationNumberRequired = true;
      }
      else {
        $scope.locationTitleRequired = false;
        $scope.locationStreetRequired = false;
        $scope.locationNumberRequired = false;
        $scope.locationAdded = true;
        $scope.newLocation = false;
        $scope.locationSelected = true;
        $scope.eventFormData.showStep4 = true;
      }
    }

    function resetAddLocation() {
      $scope.eventFormData.selectedLocation = '';
      $scope.eventFormData.locationTitle = '';
      $scope.eventFormData.locationCategory = '';
      $scope.eventFormData.locationStreet = '';
      $scope.eventFormData.locationNumber = '';
      $scope.eventFormData.locationCity = '';
      $scope.newLocation = false;
      $scope.locationSelected = false;
      $scope.locationAdded = false;
    }

    function getLocationCategories() {
      var eventPromise = cityAutocomplete.getCategories();
      eventPromise.then(function (categories) {
        $scope.categories = categories;
        console.log(categories);
      });
    }

    // Functions for places (in case of place)
    function validatePlace() {
      if (!$scope.eventFormData.placeStreet) {
        $scope.placeStreetRequired = true;
      }
      else if(!$scope.eventFormData.placeNumber) {
        $scope.placeNumberRequired = true;
      }
      else {
        $scope.eventFormData.place = $scope.eventFormData.placeStreet + ' ' + $scope.eventFormData.placeNumber;
        $scope.placeValidated = true;
        $scope.eventFormData.showStep4 = true;
      }
    }

    function changePlace() {
      $scope.placeValidated = false;
      $scope.eventFormData.showStep4 = false;
    }

  }

})();
