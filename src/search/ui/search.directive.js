'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbEvent
 * @description
 * # udb search directive
 */
angular
  .module('udb.search')
  .directive('udbSearch', searchDirective);

/* @ngInject */
function searchDirective() {
  var search = {
    templateUrl: 'templates/search.html',
    restrict: 'EA',
    controller: Search // jshint ignore:line
  };

  return search;
}
