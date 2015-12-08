'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormImageEditController
 * @description
 * # EventFormImageEditController
 * Modal for uploading images.
 */
angular
  .module('udb.event-form')
  .controller('EventFormImageEditController', EventFormImageEditController);

/* @ngInject */
function EventFormImageEditController(
  $scope,
  $uibModalInstance,
  EventFormData,
  eventCrud,
  /** @type {MediaObject} **/
  mediaObject
) {

  // Scope vars.
  $scope.saving = false;
  $scope.error = false;
  $scope.description = mediaObject.description || '';
  $scope.copyrightHolder = mediaObject.copyrightHolder || '';

  // Scope functions.
  $scope.cancel = cancel;
  $scope.updateImageInfo = updateImageInfo;

  /**
   * Cancel the modal.
   */
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }

  /**
   * Update the
   */
  function updateImageInfo() {
    var description = $scope.description,
        copyrightHolder = $scope.copyrightHolder;

    function displayErrors() {
      $scope.saving = false;
      $scope.error = true;
    }

    function updateEventFormDataAndClose(updateResponse) {
      EventFormData.updateMediaObject(updateResponse.data);
      $uibModalInstance.close();
    }

    eventCrud
      .updateImageInfo(mediaObject, description, copyrightHolder)
      .then(updateEventFormDataAndClose, displayErrors);
  }

}
