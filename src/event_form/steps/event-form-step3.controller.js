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
  function EventFormStep3Controller($scope, EventFormData, cityAutocomplete, eventTypes, $modal) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;
    
    // Autocomplete model field for the City/Postal code.
    $scope.cityAutocompleteTextField = '';
    
    // Autocomplete model field for the Location.
    $scope.locationAutocompleteTextField = '';
    
    $scope.selectedCity = '';
    $scope.selectedLocation = '';
    $scope.placeStreetAddress = '';
    $scope.placeLocationNumber = '';
    $scope.openPlaceModal = openPlaceModal;
    $scope.place = {
      'name': '',
      'eventType' : '',
      'address': {
        'addressCountry': '',
        'addressLocality': '',
        'postalCode': '',
        'streetAddress': ''
      }
    };
    
    // Validation.
    $scope.showValidation = false;

    // Convenient scope variables for current controller (in multistep).
    $scope.locationsForCity = [];
    $scope.cityAutocomplete = cityAutocomplete;

    getLocationCategories();

    // Scope functions.
    $scope.selectCity = selectCity;
    $scope.selectLocation = selectLocation;
    $scope.changeCitySelection = changeCitySelection;
    $scope.changeLocationSelection = changeLocationSelection;
    $scope.validatePlace = validatePlace;
    $scope.changeStreetAddress = changeStreetAddress;
    $scope.getLocations = getLocations;

    /**
     * Select City.
     * @returns {undefined}
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
     * @returns {undefined}
     */
    function changeCitySelection() {
      
      EventFormData.resetLocation();
      $scope.selectedCity = '';
      $scope.selectedLocation = '';
      $scope.cityAutocompleteTextField = '';
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
      
      EventFormData.showStep4 = false;
      
    }

    /**
     * Get locations for Event.
     * @returns {undefined}
     */
    function getLocations($viewValue) {
      
      var eventPromise = cityAutocomplete.getLocationsForCity($viewValue, EventFormData.location.address.postalCode);
      eventPromise.then(function (locations) {
        $scope.locationsForCity = locations;
        return $scope.locationsForCity;
      });
      
      return eventPromise;
      
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
     * @returns {undefined}
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

  }

})();
