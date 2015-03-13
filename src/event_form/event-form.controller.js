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
          EventFormData.id = event.id;
          EventFormData.isEvent = true;
          EventFormData.isPlace = false;
          EventFormData.mediaObject = event.mediaObject;
          EventFormData.name = event.name;
          $scope.loaded = true;
          EventFormData.showStep(1);
          EventFormData.showStep(2);
          EventFormData.showStep(3);
          EventFormData.showStep(4);
          EventFormData.showStep(5);
        });

      }
      else if (offerType === 'place') {
        udbApi.getPlaceById(itemId).then(function(place) {
          EventFormData.isEvent = false;
          EventFormData.isPlace = true;
          EventFormData.id = place.id;
          EventFormData.mediaObject = place.mediaObject;
          EventFormData.name = place.name;
          $scope.loaded = true;
          EventFormData.showStep(1);
          EventFormData.showStep(2);
          EventFormData.showStep(3);
          EventFormData.showStep(4);
          EventFormData.showStep(5);
        });
      }

    }
    else {
      $scope.loaded = true;
    }

  }

})();
