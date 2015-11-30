'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormFacilitiesModalController
 * @description
 * # EventFormFacilitiesModalController
 * Modal for selecting facilities.
 */
angular
  .module('udb.event-form')
  .controller('EventFormFacilitiesModalController', EventFormFacilitiesModalController);

/* @ngInject */
function EventFormFacilitiesModalController($scope, $modalInstance, EventFormData, eventCrud, facilities) {

  // Scope vars.
  $scope.saving = false;
  $scope.error = false;

  $scope.facilities = facilities;

  // Scope functions.
  $scope.cancel = cancel;
  $scope.saveFacilities = saveFacilities;

  /**
   * Cancel the modal.
   */
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  /**
   * Save the selected facilities in db.
   */
  function saveFacilities() {
    var selectedFacilities = _.where(_.union(
      $scope.facilities.motor,
      $scope.facilities.visual,
      $scope.facilities.hearing
    ), {selected: true});

    EventFormData.facilities = selectedFacilities;

    $scope.saving = true;
    $scope.error = false;

    var promise = eventCrud.updateFacilities(EventFormData);
    promise.then(function() {

      $scope.saving = false;
      $modalInstance.close();

    }, function() {
      $scope.error = true;
      $scope.saving = false;
    });
  }

}
