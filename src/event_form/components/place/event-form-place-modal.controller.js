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
  function EventFormPlaceModalController($scope, $modalInstance, eventCrud, location, categories) {

    $scope.categories = categories;
    $scope.location = location;
    
    console.warn(location);
    
    // Scope vars.
    $scope.newPlace = {
      name: '',
      eventType : '',
      address: {
        addressCountry: '',
        addressLocality: location.address.addressLocality,
        postalCode: location.address.postalCode,
        streetAddress: '',
        locationNumber : 0,
        country : 'Belgium'
      }
    };

    // Scope functions.
    $scope.validateNewPlace = validateNewPlace;
    $scope.selectPlace = selectPlace;
    $scope.savePlace = savePlace;

    /**
     * Validate the new place.
     */
    function validateNewPlace() {
      savePlace();
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

    /**
     * Save the new place in db.
     */
    function savePlace() {

      var promise = eventCrud.createPlace($scope.newPlace);
      promise.then(function(jsonResponse) {
        $scope.newPlace.id = jsonResponse.organiserId;
        selectPlace($scope.newPlace);
      });
    }

  }

})();