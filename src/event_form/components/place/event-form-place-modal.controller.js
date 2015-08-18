(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormPlaceModalController
   * @description
   * # EventFormPlaceModalController
   * Modal for adding an place.
   */
  angular
    .module('udb.event-form')
    .controller('EventFormPlaceModalController', EventFormPlaceModalController);

  /* @ngInject */
  function EventFormPlaceModalController($scope, $modalInstance, eventCrud, UdbPlace, location, categories) {

    var controller = this;

    controller.categories = categories;
    controller.location = location;

    // Scope vars.
    controller.newPlace = getDefaultPlace();
    controller.showValidation = false;
    controller.saving = false;
    controller.error = false;

    // Scope functions.
    controller.addLocation = addLocation;

    /**
     * Get the default Place data
     * @returns {UdbPlace}
     */
    function getDefaultPlace() {
      var place = new UdbPlace();

      place.setLocality(controller.location.address.addressLocality);
      place.setPostalCode(controller.location.address.postalCode);

      return place;
    }

    /**
     * Adds a location.
     * @returns {undefined}
     */
    function addLocation() {

      // Forms are automatically known in scope.
      controller.showValidation = true;
      if (!$scope.placeForm.$valid) {
        return;
      }

      controller.savePlace();

    }

    /**
     * Save the new place in db.
     */
    controller.savePlace = function() {

      controller.saving = true;
      controller.error = false;

      var place = controller.newPlace;

      function selectPlace() {
        $modalInstance.close(place);
        controller.saving = true;
        controller.error = false;
      }

      function displayError() {
        controller.saving = false;
        controller.error = true;
      }

      eventCrud.createPlace(place)
        .then(selectPlace, displayError);
    };

    controller.cancel = function () {
      $modalInstance.dismiss('creation aborted');
    };
  }
})();
