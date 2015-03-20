'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormImageUploadCtrl
 * @description
 * # EventFormImageUploadCtrl
 * Modal for uploading images.
 */
angular
  .module('udb.event-form')
  .controller('EventFormImageUploadCtrl', EventFormImageUploadController);

/* @ngInject */
function EventFormImageUploadController($scope, $modalInstance, EventFormData, eventCrud, indexToEdit,
  appConfig) {

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

  var mediaObject = null;
  // An object to edit was given.
  if (indexToEdit >= 0) {
    mediaObject = EventFormData.mediaObject[indexToEdit];
    $scope.description = mediaObject.description;
    $scope.copyright = mediaObject.copyrightHolder;
    acceptAgreements();
  }

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
    $modalInstance.dismiss('cancel');
  }

  /**
   * Upload the images and save it to db.
   */
  function uploadImages() {

    $scope.saving = true;
    $scope.error = false;

    // If we are editing, imagesToUpload is not required.
    if (mediaObject) {
      // Will be undefined if no upload was done in edit.
      updateImage($scope.imagesToUpload[0]);
    }
    else {
      // IE8/9 can't handle array. Upload 1 by 1.
      for (var i = 0; i < $scope.imagesToUpload.length; i++) {
        addImage($scope.imagesToUpload[i]);
      }
    }

  }

  /**
   * Upload and add an image.
   */
  function addImage(image) {

    var uploaded = 0;

    eventCrud.addImage(
      EventFormData,
      image,
      $scope.description,
      $scope.copyright
    ).then(function (jsonResponse) {
      EventFormData.addMediaObject(
        jsonResponse.data.url,
        jsonResponse.data.thumbnailUrl,
        $scope.description,
        $scope.copyright
      );
      uploaded++;
      if (uploaded === $scope.imagesToUpload.length) {
        $modalInstance.close();
      }
    }, function() {
      $scope.saving = false;
      $scope.error = true;
    });

  }

  /**
   * Update an image or the description.
   */
  function updateImage(image) {

    eventCrud.updateImage(
      EventFormData,
      indexToEdit,
      image,
      $scope.description,
      $scope.copyright
    ).then(function (jsonResponse) {
      EventFormData.editMediaObject(
        indexToEdit,
        jsonResponse.data.url,
        jsonResponse.data.thumbnailUrl,
        $scope.description,
        $scope.copyright
      );
      $modalInstance.close();
    }, function() {
      $scope.saving = false;
      $scope.error = true;
    });

  }

}
