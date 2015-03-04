(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormPlaceModalCtrl
   * @description
   * # EventFormPlaceModalCtrl
   * Modal for adding an place.
   */
  angular
    .module('udb.event-form')
    .controller('EventFormPlaceModalCtrl', EventFormPlaceModalController);

  /* @ngInject */
  function EventFormPlaceModalController($scope, $modalInstance, eventCrud, UdbPlace, location, categories) {

    $scope.categories = categories;
    $scope.location = location;
    
    // Scope vars.
    $scope.newPlace = getDefaultPlace();
    
    $scope.titleRequired = false;
    $scope.streetRequired = false;
    $scope.numberRequired = false;
    $scope.categoryRequired = false;
    $scope.placeValid = false;

    // Scope functions.
    $scope.addLocation = addLocation;
    $scope.resetAddLocation = resetAddLocation;
    
    /**
     * Get the default Place data
     * @returns {undefined}
     */
    function getDefaultPlace() {
      return {
        name: '',
        eventType : '',
        address: {
          addressCountry: 'BE',
          addressLocality: $scope.location.address.addressLocality,
          postalCode: $scope.location.address.postalCode,
          streetAddress: '',
          locationNumber : 0,
          country : 'Belgium'
        }
      };
    }
    
    /**
     * Reset the location field(s).
     * @returns {undefined}
     */
    function resetAddLocation() {
      
      // Clear the current place data.
      $scope.newPlace = getDefaultPlace();
      
      // Close the modal.
      $modalInstance.close($scope.newPlace);
      
    }
    /**
     * Adds a location.
     * @returns {undefined}
     */
    function addLocation() {
      
      $scope.placeValid = true;

      if ($scope.newPlace.name === '') {
        $scope.titleRequired = true;
        $scope.placeValid = false;
      }
      if ($scope.newPlace.address.streetAddress === '') {
        $scope.streetRequired = true;
        $scope.placeValid = false;
      }
      if ($scope.newPlace.address.locationNumber === '') {
        $scope.numberRequired = true;
        $scope.placeValid = false;
      }
      if ($scope.newPlace.eventType === '') {
        $scope.categoryRequired = true;
        $scope.placeValid = false;
      }
      
      if ($scope.placeValid) {
        savePlace();
      }
    }

    /**
     * Save the new place in db.
     */
    function savePlace() {
        
      // Convert this place data to a Udb-place.
      var eventTypeLabel = '';
      for (var i = 0; i < $scope.categories.length; i++) {
        if ($scope.categories[i].id === $scope.newPlace.eventType) {
          eventTypeLabel = $scope.categories[i].label;
          break;
        }
      }
        
      var udbPlace = new UdbPlace();
      udbPlace.name = {nl : $scope.newPlace.name};
      udbPlace.calendarType = 'permanent';
      udbPlace.type = {
        id : $scope.newPlace.eventType,
        label : eventTypeLabel,
        domain : 'eventtype'
      };
      udbPlace.address = {
        addressCountry : 'BE',
        addressLocality : $scope.newPlace.address.addressLocality,
        postalCode : $scope.newPlace.address.postalCode,
        streetAddress : $scope.newPlace.address.streetAddress + ' ' + $scope.newPlace.address.locationNumber
      };

      var promise = eventCrud.createPlace(udbPlace);
      promise.then(function(jsonResponse) {
        udbPlace.id = jsonResponse.placeId;
        console.warn(udbPlace);
        selectPlace(udbPlace);
      });
    }

    /**
     * Select the place that should be used.
     * 
     * @param {string} place 
     *   Name of the place
     */
    function selectPlace(place) {
      $modalInstance.close(place);
    }

  }

})();