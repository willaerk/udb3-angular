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
  jsonLDLangFilter,
  eventTranslator,
  eventLabeller,
  eventEditor,
  EventTranslationState,
  $scope,
  variationRepository,
  $window
) {
  var controller = this;
  /* @type {UdbPlace} */
  var cachedEvent;

  // Translation
  var defaultLanguage = 'nl';
  controller.availableLabels = eventLabeller.recentLabels;
  initController();

  function initController() {
    if (!$scope.event.title) {
      controller.fetching = true;
      var placePromise = udbApi.getPlaceByLDId($scope.event['@id']);

      placePromise.then(function (placeObject) {
        cachedEvent = placeObject;
        controller.availableLabels = _.union(cachedEvent.labels, eventLabeller.recentLabels);

        $scope.event = cachedEvent;
        controller.fetching = false;
        watchLabels();
      });
    } else {
      controller.fetching = false;
    }

    function watchLabels() {
      $scope.$watch(function () {
        return cachedEvent.labels;
      }, function (labels) {
        $scope.event.labels = angular.copy(labels);
      });
    }
  }

}
