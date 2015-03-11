(function () {
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
  function EventFormImageUploadController($scope, $modalInstance, EventFormData, eventCrud) {

    // Scope vars.
    $scope.saving = false;
    $scope.error = false;
    $scope.showAgreements = true;
    $scope.modalTitle = 'Gebruiksvoorwaarden';

    // Scope functions.
    $scope.acceptAgreements = acceptAgreements;
    $scope.cancel = cancel;
    $scope.uploadImage = uploadImage;

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
     * Upload the image and save it to db.
     */
    function uploadImage() {

      $scope.saving = true;
      $scope.error = false;

      var promise = eventCrud.addImage(EventFormData);
      promise.then(function() {

        $scope.saving = false;
        $modalInstance.close();

      }, function() {
        $scope.error = true;
        $scope.saving = false;
      });
    }

  }

})();
