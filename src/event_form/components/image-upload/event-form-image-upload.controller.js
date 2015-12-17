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
  appConfig
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
  $scope.uploadImages = uploadImages;

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

  /**
   * Upload the images and save it to db.
   */
  function uploadImages() {
    startUploading();

    _.forEach($scope.imagesToUpload, function (image) {
      addImage(image);
    });
  }

  function startUploading() {
    $scope.saving = true;
    $scope.error = false;
  }

  /**
   * Upload and add an image.
   */
  function addImage(image) {

    var uploaded = 0;

    function displayUploadError() {
      $scope.saving = false;
      $scope.error = true;
    }

    eventCrud.addImage(
      EventFormData,
      image,
      $scope.description,
      $scope.copyright
    ).then(function (jsonResponse) {
      var image = {
        id: _.uniqueId(),
        url : jsonResponse.data.url,
        thumbnailUrl : jsonResponse.data.thumbnailUrl,
        description : $scope.description,
        copyrightHolder : $scope.copyright
      };
      EventFormData.addImage(image);
      uploaded++;
      if (uploaded === $scope.imagesToUpload.length) {
        $uibModalInstance.close();
      }
    }, displayUploadError);

  }

}
