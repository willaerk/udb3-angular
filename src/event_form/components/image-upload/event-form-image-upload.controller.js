'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormImageUploadController
 * @description
 * # EventFormImageUploadController
 * Modal for uploading images.
 */
angular
  .module('udb.event-form')
  .controller('EventFormImageUploadController', EventFormImageUploadController);

/* @ngInject */
function EventFormImageUploadController(
  $scope,
  $uibModalInstance,
  EventFormData,
  eventCrud,
  appConfig,
  MediaManager,
  $q
) {

  // Scope vars.
  $scope.uploadTermsConditionsUrl = appConfig.uploadTermsConditionsUrl;
  $scope.uploadCopyRightInfoUrl = appConfig.uploadCopyRightInfoUrl;
  $scope.saving = false;
  $scope.error = false;
  $scope.showAgreements = true;
  $scope.modalTitle = 'Gebruiksvoorwaarden';
  $scope.imagesToUpload = [];
  $scope.description = '';
  $scope.copyright = '';

  // Scope functions.
  $scope.acceptAgreements = acceptAgreements;
  $scope.cancel = cancel;
  $scope.uploadImages = uploadAndAddImage;

  /**
   * Accept the agreements.
   */
  function acceptAgreements() {
    $scope.modalTitle = 'Nieuwe afbeelding toevoegen';
    $scope.showAgreements = false;
  }

  /**
   * Cancel the modal.
   */
  function cancel() {
    $uibModalInstance.dismiss('cancel');
  }

  function uploadAndAddImage() {
    var file = $scope.imagesToUpload[0],
        description = $scope.description,
        copyrightHolder = $scope.copyright;

    var deferredAddition = $q.defer();

    function displayError(error) {
      $scope.saving = false;
      $scope.error = error;
    }

    /**
     * @param {MediaObject} mediaObject
     */
    function addImageToEvent(mediaObject) {
      function updateEventFormAndResolve() {
        EventFormData.addImage(mediaObject);
        deferredAddition.resolve(mediaObject);
        $uibModalInstance.close(mediaObject);
      }

      eventCrud
        .addImage(EventFormData, mediaObject)
        .then(updateEventFormAndResolve, displayError);
    }

    MediaManager
      .createImage(file, description, copyrightHolder)
      .then(addImageToEvent, displayError);

    return deferredAddition.promise;
  }
}
