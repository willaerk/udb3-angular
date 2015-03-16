'use strict';

/**
 * @ngdoc directive
 * @name udb.place-detail.directive:place-detail.html
 * @description
 * # udb place-detail directive
 */
angular
  .module('udb.place-detail')
  .directive('udbPlaceDetail', udbPlaceDetailDirective);

/* @ngInject */
function udbPlaceDetailDirective() {
  return {
    templateUrl: 'templates/place-detail.html',
    restrict: 'EA',
    controller: PlaceDetail // jshint ignore:line
  };
}
