'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormImageDeleteCtrl
 * @description
 * # EventFormImageDeleteCtrl
 * Modal for deleting images.
 */
angular
  .module('udb.event-form')
  .controller('EventFormImageDeleteCtrl', EventFormImageDeleteController);

/* @ngInject */
function EventFormImageDeleteController($scope, $modalInstance, EventFormData, eventCrud, indexToDelete) {

  // Scope vars.
  $scope.saving = false;
  $scope.error = false;

  // Scope functions.
  $scope.cancel = cancel;
  $scope.deleteImage = deleteImage;

  /**
   * Cancel the modal.
   */
  function cancel() {
    $modalInstance.dismiss('cancel');
  }

  /**
   * Upload the images and save it to db.
   */
  function deleteImage() {

    $scope.saving = true;
    $scope.error = false;

    eventCrud.deleteImage(EventFormData, indexToDelete).then(function() {
      EventFormData.deleteMediaObject(indexToDelete);
      $scope.saving = false;
      $modalInstance.close();
    }, function() {
      $scope.error = true;
      $scope.saving = false;
    });

  }

}
