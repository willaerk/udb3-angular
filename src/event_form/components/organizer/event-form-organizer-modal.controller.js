(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormOrganizerModalCtrl
   * @description
   * # EventFormOrganizerModalCtrl
   * Modal for adding an organizer.
   */
  angular
    .module('udb.event-form')
    .controller('EventFormOrganizerModalCtrl', EventFormOrganizerModalController);

  /* @ngInject */
  function EventFormOrganizerModalController($scope, $modalInstance, udbOrganizers, eventCrud) {

    // Scope vars.
    $scope.organizersFound = false;
    $scope.loading = false;
    $scope.showValidation = false;
    $scope.organizers = [];
    

    $scope.newOrganizer = {
      name : '',
      street : '',
      number : '',
      city : '',
      postalCode: '',
      country : 'Belgium',
      contact: []
    };

    // Scope functions.
    $scope.cancel = cancel;
    $scope.addOrganizerContactInfo = addOrganizerContactInfo;
    $scope.deleteOrganizerContactInfo = deleteOrganizerContactInfo;
    $scope.validateNewOrganizer = validateNewOrganizer;
    $scope.selectOrganizer = selectOrganizer;
    $scope.saveOrganizer = saveOrganizer;

    /**
     * Cancel the modal.
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    /**
     * Add a contact info entry for an organizer.
     */
    function addOrganizerContactInfo(type) {
      $scope.newOrganizer.contact.push({
        type : type,
        value : ''
      });
    }

    /**
     * Remove a given key of the contact info.
     */
    function deleteOrganizerContactInfo(index) {
      $scope.newOrganizer.contact.splice(index, 1);
    }

    /**
     * Validate the new organizer.
     */
    function validateNewOrganizer() {

      $scope.showValidation = true;
      // Forms are automatically known in scope.
      if (!$scope.organizerForm.$valid) {
        return;
      }

      var promise = udbOrganizers.searchDuplicates($scope.newOrganizer.name, $scope.newOrganizer.postalCode);

      $scope.loading = true;

      promise.then(function (data) {

        // Set the results for the duplicates modal,
        if (data.length > 0) {
          $scope.organizersFound = true;
          $scope.organizers = data;
          $scope.loading = false;
        }
        // or save the event immediataly if no duplicates were found.
        else {
          saveOrganizer();
        }

      });

    }

    /**
     * Select the organizer that should be used.
     */
    function selectOrganizer(organizer) {
      $modalInstance.close(organizer);
    }

    /**
     * Save the new organizer in db.
     */
    function saveOrganizer() {

      $scope.loading = true;
      var promise = eventCrud.createOrganizer($scope.newOrganizer);
      promise.then(function(jsonResponse) {
        $scope.newOrganizer.id = jsonResponse.organiserId;
        selectOrganizer($scope.newOrganizer);
        $scope.loading = false;
      });
    }

  }

})();
