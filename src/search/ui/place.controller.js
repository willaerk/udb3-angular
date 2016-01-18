'use strict';

/**
 * @ngdoc directive
 * @name udb.search.controller:PlaceController
 * @description
 * # EventController
 */
angular
  .module('udb.search')
  .controller('PlaceController', PlaceController);

/* @ngInject */
function PlaceController(
  udbApi,
  $scope
) {
  var controller = this;
  initController();

  function initController() {
    if (!$scope.event.title) {
      controller.fetching = true;
      var placePromise = udbApi.getPlaceByLDId($scope.event['@id']);

      placePromise.then(function (placeObject) {
        $scope.event = placeObject;
        controller.fetching = false;
      });
    } else {
      controller.fetching = false;
    }
  }

}
