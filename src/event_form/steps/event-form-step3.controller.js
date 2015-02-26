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
  function EventFormStep3Controller($scope, EventFormData, cityAutocomplete, eventTypes) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;
    $scope.eventFormData.cityId = '';
    $scope.eventFormData.cityLabel = '';
    $scope.eventFormData.locationId = '';
    $scope.eventFormData.locationLabel = '';
    $scope.eventFormData.locationTitle = '';
    $scope.eventFormData.locationCategoryId = '';
    $scope.eventFormData.locationStreet = '';
    $scope.eventFormData.locationNumber = '';
    $scope.eventFormData.placeStreet = '';
    $scope.eventFormData.placeNumber = '';
    $scope.eventFormData.place = '';

    // storage for step 3
    $scope.locationsForCity = [];
    $scope.citySelected = false;
    $scope.noLocationsFound = false;
    $scope.locationSelected = false;
    $scope.locationAdded = false;
    $scope.autoLocationSearch = true;
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
    $scope.showAddLocation = showAddLocation;
    $scope.addLocation = addLocation;
    $scope.resetAddLocation = resetAddLocation;
    $scope.validatePlace = validatePlace;
    $scope.changePlace = changePlace;
    $scope.getLocations = getLocations;

    // Functions for cities.
    function selectCity($item, $model, $label) {
      $scope.eventFormData.cityId = $model;
      $scope.eventFormData.cityLabel = $label;
      $scope.citySelected = true;
      $scope.eventFormData.place = '';
      $scope.placeValidated = false;
    }

    function changeCitySelection() {
      $scope.eventFormData.cityId = '';
      $scope.eventFormData.cityLabel = '';
      $scope.eventFormData.place = '';
      $scope.eventFormData.placeStreet = '';
      $scope.eventFormData.placeNumber = '';
      $scope.placeValidated = false;
      $scope.citySelected = false;
      $scope.eventFormData.showStep4 = false;
    }

    // Functions for locations (in case of event)
    function getLocations($viewValue) {
      var eventPromise = cityAutocomplete.getLocationsForCity($viewValue);
      eventPromise.then(function (locations) {
        $scope.locationsForCity = locations;

      });
      if ($scope.locationsForCity.length > 0) {
        $scope.noLocationsFound = false;
      }
      else {
        $scope.noLocationsFound = true;
      }
      return $scope.locationsForCity;
    }

    function selectLocation($item, $model, $label) {
      $scope.eventFormData.locationId = $model;
      $scope.eventFormData.locationLabel = $label;
      $scope.locationSelected = true;
      $scope.eventFormData.showStep4 = true;
    }

    function changeLocationSelection() {
      $scope.eventFormData.locationId = '';
      $scope.eventFormData.locationLabel = '';
      $scope.eventFormData.showStep4 = false;
      if ($scope.locationAdded) {
        $scope.autoLocationSearch  = false;
      }
      else {
        $scope.autoLocationSearch  = true;
        $scope.locationSelected = false;
      }
    }

    function showAddLocation () {
      $scope.autoLocationSearch  = false;
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
        $scope.eventFormData.locationLabel = '';
        $scope.eventFormData.locationLabel = $scope.eventFormData.locationStreet + ' ' + $scope.eventFormData.locationNumber;
        $scope.locationTitleRequired = false;
        $scope.locationStreetRequired = false;
        $scope.locationNumberRequired = false;
        $scope.locationAdded = true;
        $scope.locationSelected = true;
        $scope.autoLocationSearch  = true;
        $scope.eventFormData.showStep4 = true;
      }
    }

    function resetAddLocation() {
      $scope.eventFormData.locationLabel = '';
      $scope.eventFormData.locationId = '';
      $scope.eventFormData.locationTitle = '';
      $scope.eventFormData.locationCategoryId = '';
      $scope.eventFormData.locationStreet = '';
      $scope.eventFormData.locationNumber = '';
      $scope.newLocation = false;
      $scope.locationSelected = false;
      $scope.locationAdded = false;
    }

    function getLocationCategories() {
      var eventPromise = eventTypes.getCategories();
      eventPromise.then(function (categories) {
        $scope.categories = categories.place;
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
