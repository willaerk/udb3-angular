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
  function EventFormOrganizerModalController($scope, $modalInstance, udbOrganizers) {

    // Scope vars.
    $scope.organizersFound = false;
    $scope.organizers = [];

    $scope.newOrganizer = {
      name : '',
      street : '',
      number : '',
      city : '',
      zip: '',
      contact: []
    };

    // Scope functions.
    $scope.addOrganizerContactInfo = addOrganizerContactInfo;
    $scope.deleteOrganizerContactInfo = deleteOrganizerContactInfo;
    $scope.validateNewOrganizer = validateNewOrganizer;
    $scope.selectOrganizer = selectOrganizer;

    /**
     * Add a contact info entry for an organizer.
     */
    function addOrganizerContactInfo(type) {
      $scope.newOrganiser.contact.push({
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

      var promise = udbOrganizers.searchDuplicates($scope.newOrganizer.title, $scope.newOrganizer.zip);

      $scope.loading = true;

      promise.then(function (data) {

        // Set the results for the duplicates modal,
        if (data.length > 0) {
          $scope.organizersFound = true;
          $scope.organizers = data;
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
      selectOrganizer($scope.newOrganiser);
      $modalInstance.close($scope.newOrganiser);
    }

  }

})();
