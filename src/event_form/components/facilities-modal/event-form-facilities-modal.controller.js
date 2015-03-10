(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormFacilitiesModalCtrl
   * @description
   * # EventFormFacilitiesModalCtrl
   * Modal for selecting facilities.
   */
  angular
    .module('udb.event-form')
    .controller('EventFormFacilitiesModalCtrl', EventFormFacilitiesModalController);

  /* @ngInject */
  function EventFormFacilitiesModalController($scope, $modalInstance, EventFormData, eventCrud, eventFormFacilities) {

    // Scope vars.
    $scope.saving = false;
    $scope.error = false;

    $scope.facilities = {
      motor : [],
      visual : [],
      hearing : []
    };

    var eventPromise = eventFormFacilities.getFacilities();
    eventPromise.then(function (facilities) {
      $scope.facilities = facilities;
    });

    // Scope functions.
    $scope.cancel = cancel;
    $scope.saveFacilities = saveFacilities;

    /**
     * Cancel the modal.
     */
    function cancel() {
      $modalInstance.dismiss('cancel');
    }

    /**
     * Save the selected facilities in db.
     */
    function saveFacilities() {

      EventFormData.facilities = [];

      // Add all selected motor facilities.
      var i;
      for (i = 0; i < $scope.facilities.motor.length; i++) {
        if ($scope.facilities.motor[i].selected) {
          EventFormData.facilities.push($scope.facilities.motor[i]);
        }
      }

      // Add all selected visual facilities.
      for (i = 0; i < $scope.facilities.visual.length; i++) {
        if ($scope.facilities.visual[i].selected) {
          EventFormData.facilities.push($scope.facilities.visual[i]);
        }
      }

      // Add all selected hearing facilities.
      for (i = 0; i < $scope.facilities.hearing.length; i++) {
        if ($scope.facilities.hearing[i].selected) {
          EventFormData.facilities.push($scope.facilities.hearing[i]);
        }
      }

      $scope.saving = true;
      $scope.error = false;

      var promise = eventCrud.updateFacilities(EventFormData);
      promise.then(function(jsonResponse) {

        $scope.saving = false;
        $modalInstance.close();

      }, function() {
        $scope.error = true;
        $scope.saving = false;
      });
    }

  }

})();
