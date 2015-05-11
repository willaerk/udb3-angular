
'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventDeleteConfirmModalCtrl
 * @description
 * # EventDeleteConfirmModalCtrl
 * Modal to delete an event.
 */
angular
  .module('udb.dashboard')
  .controller('EventDeleteConfirmModalCtrl', EventDeleteConfirmModalController);

/* @ngInject */
function EventDeleteConfirmModalController($scope, $modalInstance, eventCrud, item) {

  $scope.item = item;
  $scope.saving = false;

  $scope.cancelRemoval = cancelRemoval;
  $scope.deleteEvent = deleteEvent;

  /**
   * Remove the event in db.
   */
  function deleteEvent() {

    $scope.saving = true;

    var promise = eventCrud.removeEvent(item.details.id, item);
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
