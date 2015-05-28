'use strict';

/**
 * @ngdoc function
 * @name udbApp.controller:EventFormReservationModalCtrl
 * @description
 * # EventFormImageUploadCtrl
 * Modal for setting the reservation period.
 */
angular
  .module('udb.event-form')
  .controller('EventFormReservationModalCtrl', EventFormReservationModalController);

/* @ngInject */
function EventFormReservationModalController($scope, $modalInstance, EventFormData, eventCrud) {

  // Scope vars.
  $scope.eventFormData = EventFormData;
  $scope.showStartDateRequired = false;
  $scope.showEndDateRequired = false;
  $scope.saving = false;
  $scope.errorMessage = '';

  // Scope functions.
  $scope.cancel = cancel;
  $scope.save = save;

  var initialStartDate = EventFormData.bookingInfo.availabilityStarts;
  var initialEndDate = EventFormData.bookingInfo.availabilityEnds;

  /**
   * Cancel the modal.
   */
  function cancel() {
    EventFormData.bookingInfo.availabilityStarts = initialStartDate;
    EventFormData.bookingInfo.availabilityEnds = initialEndDate;
    $modalInstance.dismiss('cancel');
  }

  /**
   * Save the period.
   */
  function save() {

    $scope.errorMessage = '';

    $scope.showStartDateRequired = false;
    if (!EventFormData.bookingInfo.availabilityStarts) {
      $scope.showStartDateRequired = true;
    }

    $scope.showEndDateRequired = false;
    if (!EventFormData.bookingInfo.availabilityEnds) {
      $scope.showEndDateRequired = true;
    }

    if ($scope.showStartDateRequired || $scope.showEndDateRequired) {
      return;
    }

    if (EventFormData.bookingInfo.availabilityStarts > EventFormData.bookingInfo.availabilityEnds) {
      $scope.errorMessage = 'De gekozen einddatum moet na de startdatum vallen.';
      return;
    }

    $scope.saving = true;

    // Make sure all default values are set.
    EventFormData.bookingInfo = angular.extend({}, {
      url : '',
      urlLabel : 'Reserveer plaatsen',
      email : '',
      phone : '',
      availabilityStarts : '',
      availabilityEnds : ''
    }, EventFormData.bookingInfo);

    var promise = eventCrud.updateBookingInfo(EventFormData);
    promise.then(function() {
      $scope.saving = false;
      $modalInstance.close();
    }, function() {
      $scope.saving = false;
      $scope.errorMessage = 'Er ging iets fout bij het bewaren van de info.';
    });

  }

}
