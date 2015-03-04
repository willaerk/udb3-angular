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

    // Convenient scope variables for current controller (in multistep).
    $scope.locationsForCity = [];
    
    $scope.noLocationsFound = false;
    $scope.locationSelected = false;
    $scope.locationAdded = false;
    $scope.autoLocationSearch = true;
    $scope.locationTitleRequired = false;
    $scope.locationStreetRequired = false;
    $scope.locationNumberRequired = false;
    $scope.placeValidated = false;
    $scope.cityAutocomplete = cityAutocomplete;

    getLocationCategories();

    // Scope functions.
    $scope.selectCity = selectCity;
    $scope.selectLocation = selectLocation;
    $scope.changeCitySelection = changeCitySelection;
    $scope.changeLocationSelection = changeLocationSelection;
    $scope.showAddLocation = showAddLocation;
    $scope.validatePlace = validatePlace;
    $scope.changePlace = changePlace;
    $scope.getLocations = getLocations;

    /**
     * Select City.
     * @returns {undefined}
     */
    function selectCity($item, $model, $label) {
      
      EventFormData.location.address.postalCode = $item.zip;
      EventFormData.location.address.addressLocality = $item.name;
      $scope.selectedCity = $label;
      $scope.placeValidated = false;
      
    }

    /**
     * Change a city selection.
     * @returns {undefined}
     */
    function changeCitySelection() {
      
      EventFormData.resetLocation();
      $scope.placeValidated = false;
      $scope.selectedCity = '';
      $scope.eventFormData.showStep4 = false;
      
    }

    /**
     * Get locations for Event.
     * @returns {undefined}
     */
    function getLocations($viewValue) {
      
      var eventPromise = cityAutocomplete.getLocationsForCity($viewValue, EventFormData.location.address.postalCode);
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

    /**
     * Select location.
     * @returns {undefined}
     */
    function selectLocation($item, $model, $label) {
      $scope.eventFormData.locationId = $model;
      $scope.eventFormData.locationLabel = $label;
      $scope.locationSelected = true;
      $scope.eventFormData.showStep4 = true;
    }

    /**
     * Change selected location.
     * @returns {undefined}
     */
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

    /**
     * Show a location.
     * @returns {undefined}
     */
    function showAddLocation () {
      $scope.autoLocationSearch  = false;
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
      
      // Old vars.
      showAddLocation();

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
        
        console.log(place);
        // Assign the just saved place to the event form data.
        EventFormData.place = place;
        
        // Assign selection, hide the location field and show the selection.
        $scope.eventFormData.locationId = place.id;
        $scope.eventFormData.locationLabel = place.getName('nl');
        $scope.selectedCity = place.address.postalCode + ' ' + place.address.addressLocality;
        $scope.locationSelected = true;
        $scope.locationAdded = true;
        
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
        $scope.eventFormData.setLocation(location);
        
        $scope.eventFormData.showStep4 = true;
      
      });

    }

    /**
     * Validate Place
     * @returns {undefined}
     */
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

    /**
     * Change Place
     * @returns {undefined}
     */
    function changePlace() {
      $scope.placeValidated = false;
      $scope.eventFormData.showStep4 = false;
    }

  }

})();
