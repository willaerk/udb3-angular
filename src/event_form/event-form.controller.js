(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormCtrl
   * @description
   * # EventFormCtrl
   * Init the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormCtrl', EventFormController);

  /* @ngInject */
  function EventFormController($scope, itemId, offerType, EventFormData, udbApi) {

    // Other controllers won't load untill this boolean is set to true.
    $scope.loaded = false;

    // Fill the event form data if an event is beïng edited.
    if (itemId) {

      if (offerType === 'event') {
        udbApi.getEventById(itemId).then(function(event) {
          EventFormData.id = event['@id'];
          EventFormData.mediaObject = event.mediaObject;
          EventFormData.name = event.name;
          $scope.loaded = true;
        });

      }
      else {
        var place = udbApi.getPlaceById();
      }

    }
    else {
      $scope.loaded = true;
    }

  }

})();
