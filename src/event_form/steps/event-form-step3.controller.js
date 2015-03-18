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
function EventFormStep3Controller($scope, EventFormData, cityAutocomplete, eventTypes, $modal) {

  // Scope vars.
  // main storage for event form.
  $scope.eventFormData = EventFormData;

  // Autocomplete model field for the City/Postal code.
  $scope.cityAutocompleteTextField = '';

  // Autocomplete model field for the Location.
  $scope.locationAutocompleteTextField = '';

  // Autocomplete helper vars.
  $scope.searchingCities = false;
  $scope.cityAutoCompleteError = false;
  $scope.searchingLocation = false;
  $scope.locationAutoCompleteError = false;
  $scope.locationsSearched = false;

  $scope.selectedCity = '';
  $scope.selectedLocation = '';
  $scope.openPlaceModal = openPlaceModal;

  // Validation.
  $scope.showValidation = false;

  // Convenient scope variables for current controller (in multistep).
  $scope.locationsForCity = [];

  getLocationCategories();

  // Scope functions.
  $scope.getCities = getCities;
  $scope.selectCity = selectCity;
  $scope.selectLocation = selectLocation;
  $scope.changeCitySelection = changeCitySelection;
  $scope.changeLocationSelection = changeLocationSelection;
  $scope.validatePlace = validatePlace;
  $scope.changeStreetAddress = changeStreetAddress;
  $scope.getLocations = getLocations;
  $scope.setMajorInfoChanged = setMajorInfoChanged;

  // Default values
  if (EventFormData.location && EventFormData.location.address) {

    $scope.selectedCity = EventFormData.location.address.postalCode +
      ' ' + EventFormData.location.address.addressLocality;

    // Location has a name => an event.
    if (EventFormData.location.name) {
      $scope.selectedLocation = EventFormData.location.name;
    }
    else {
      var streetParts = EventFormData.location.address.streetAddress.split(' ');
      EventFormData.placeNumber = streetParts.pop();
      EventFormData.placeStreet = streetParts.join(' ');
      $scope.selectedLocation = EventFormData.location.address.streetAddress;
    }

  }

  /**
   * Automplete function for cities.
   */
  function getCities(value) {

    $scope.searchingCities = true;
    $scope.cityAutoCompleteError = false;

    var promise = cityAutocomplete.getCities(value, EventFormData.location.address.postalCode);
    return promise.then(function (cities) {
      $scope.searchingCities = false;
      return cities.data;
    }, function() {
      $scope.searchingCities = false;
      $scope.cityAutoCompleteError = true;
      return [];
    });
  }

  /**
   * Select City.
   */
  function selectCity($item, $model, $label) {

    EventFormData.resetLocation();
    var location = $scope.eventFormData.getLocation();
    location.address.postalCode = $item.zip;
    location.address.addressLocality = $item.name;
    EventFormData.setLocation(location);

    $scope.cityAutocompleteTextField = '';
    $scope.selectedCity = $label;
    $scope.selectedLocation = '';

  }

  /**
   * Change a city selection.
   */
  function changeCitySelection() {

    EventFormData.resetLocation();
    $scope.selectedCity = '';
    $scope.selectedLocation = '';
    $scope.cityAutocompleteTextField = '';
    $scope.locationsSearched = false;
    $scope.locationAutocompleteTextField = '';
    EventFormData.showStep4 = false;

  }

  /**
   * Select location.
   * @returns {undefined}
   */
  function selectLocation($item, $model, $label) {

    // Assign selection, hide the location field and show the selection.
    $scope.selectedLocation = $label;
    $scope.locationAutocompleteTextField = '';

    var location = EventFormData.getLocation();
    location.id = $model;
    location.name = $label;
    EventFormData.setLocation(location);

    EventFormData.showStep4 = true;
    setMajorInfoChanged();

  }

  /**
   * Change selected location.
   * @returns {undefined}
   */
  function changeLocationSelection() {

    // Reset only the location data of the location.
    var location = EventFormData.getLocation();
    location.id = '';
    location.name = '';
    EventFormData.setLocation(location);

    //$scope.selectedCity = '';
    $scope.selectedLocation = '';
    $scope.locationAutocompleteTextField = '';
    $scope.locationsSearched = false;

    EventFormData.showStep4 = false;

  }

  /**
   * Get locations for Event.
   * @returns {undefined}
   */
  function getLocations($viewValue) {

    $scope.searchingLocation = true;
    $scope.locationAutoCompleteError = false;

    var promise = cityAutocomplete.getLocationsForCity($viewValue, EventFormData.location.address.postalCode);
    return promise.then(function (cities) {
      $scope.locationsForCity = cities.data;
      $scope.locationsSearched = true;
      $scope.searchingLocation = false;
      return $scope.locationsForCity;
    }, function() {
      $scope.locationsSearched = false;
      $scope.searchingLocation = false;
      $scope.locationAutoCompleteError = true;
      return [];
    });

  }

  /**
   * Get the location categories.
   * @returns {undefined}
   */
  function getLocationCategories() {

    var eventPromise = eventTypes.getCategories();
    eventPromise.then(function (categories) {
      $scope.categories = categories.place;
    });

  }

  /**
   * Open the organizer modal.
   */
  function openPlaceModal() {

    var modalInstance = $modal.open({
      templateUrl: 'templates/event-form-place-modal.html',
      controller: 'EventFormPlaceModalCtrl',
      resolve: {
        location: function () {
          return $scope.eventFormData.location;
        },
        categories: function () {
          return $scope.categories;
        }
      }
    });

    modalInstance.result.then(function (place) {

      // Assign the just saved place to the event form data.
      EventFormData.place = place;

      // Assign selection, hide the location field and show the selection.
      $scope.selectedCity = place.address.postalCode + ' ' + place.address.addressLocality;
      $scope.selectedLocation = place.getName('nl');

      var location = {
        'id' : place.id,
        'name': place.getName('nl'),
        'address': {
            'addressCountry': 'BE',
            'addressLocality': place.address.addressLocality,
            'postalCode': place.address.postalCode,
            'streetAddress': place.address.streetAddress
        }
      };
      EventFormData.setLocation(location);

      EventFormData.showStep4 = true;

    });

  }

  /**
   * Validate Place
   * @returns {undefined}
   */
  function validatePlace() {

    // Forms are automatically known in scope.
    $scope.showValidation = true;
    if (!$scope.step3Form.$valid) {
      return;
    }

    var location = EventFormData.getLocation();
    location.address.addressCountry = 'BE';
    location.address.streetAddress = EventFormData.placeStreet + ' ' + EventFormData.placeNumber;
    EventFormData.setLocation(location);

    $scope.selectedLocation = location.address.streetAddress;

    EventFormData.showStep4 = true;

  }

  /**
   * Change StreetAddress
   */
  function changeStreetAddress() {

    // Reset only the street/number data of the location.
    var location = EventFormData.getLocation();
    location.address.addressCountry = '';
    location.address.streetAddress = '';
    EventFormData.setLocation(location);

    $scope.selectedLocation = '';

    EventFormData.showStep4 = false;

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
