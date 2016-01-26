'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbEvent
 * @description
 * # udbEvent
 */
angular
  .module('udb.search')
  .directive('udbPlace', udbPlace);

/* @ngInject */
function udbPlace() {
  var placeDirective = {
    restrict: 'AE',
    controller: 'PlaceController',
    controllerAs: 'placeCtrl',
    templateUrl: 'templates/place.directive.html'
  };

  return placeDirective;
}
