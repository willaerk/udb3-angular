'use strict';

/**
 * @ngdoc directive
 * @name udb.event-detail.directive:event-detail.html
 * @description
 * # udb event-detail directive
 */
angular
  .module('udb.event-detail')
  .directive('udbEventDetail', udbEventDetailDirective);

/* @ngInject */
function udbEventDetailDirective() {
  return {
    templateUrl: 'templates/event-detail.html',
    restrict: 'EA',
    controller: EventDetail // jshint ignore:line
  };
}
