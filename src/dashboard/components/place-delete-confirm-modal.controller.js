
'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:PlaceDeleteConfirmModalCtrl
 * @description
 * # PlaceDeleteConfirmModalCtrl
 * Modal to delete an event.
 */
angular
  .module('udb.dashboard')
  .controller('PlaceDeleteConfirmModalCtrl', PlaceDeleteConfirmModalController);

/* @ngInject */
function PlaceDeleteConfirmModalController($scope, $modalInstance, eventCrud, item, hasEvents) {

  $scope.item = item;
  $scope.saving = false;
  $scope.hasEvents = hasEvents;
  console.log('hasEvents: ' + hasEvents);

  $scope.cancelRemoval = cancelRemoval;
  $scope.deletePlace = deletePlace;

  /**
   * Remove the event in db.
   */
  function deletePlace() {

    // Extra check in case delete place is tried with events.
    if (hasEvents) {
      $modalInstance.dismiss();
    }

    $scope.saving = true;
    console.log('Location id to remove: ' + item.details.id);
    var promise = eventCrud.removePlace(item.details.id, item);
    promise.then(function(jsonResponse) {
      $modalInstance.close(item);
      $scope.saving = false;
      var success = true;
      return success;

    }, function() {

      $modalInstance.close(item);
      $scope.saving = false;
      return false;

    });

  }

  /**
   * Cancel, modal dismiss.
   */
  function cancelRemoval() {
    $modalInstance.dismiss();
  }

}
