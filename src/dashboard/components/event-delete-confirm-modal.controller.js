
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
  $scope.error = false;

  $scope.cancelRemoval = cancelRemoval;
  $scope.deleteEvent = deleteEvent;

  /**
   * Remove the event in db.
   */
  function deleteEvent() {

    $scope.error = false;
    $scope.saving = true;

    var promise = eventCrud.removeEvent(item.id);
    promise.then(function(jsonResponse) {
      $scope.saving = false;
      $modalInstance.close(item);
    }, function() {
      $scope.saving = false;
      $scope.error = true;
    });

  }

  /**
   * Cancel, modal dismiss.
   */
  function cancelRemoval() {
    $modalInstance.dismiss();
  }

}
