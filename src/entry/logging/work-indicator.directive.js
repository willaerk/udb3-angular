'use strict';

/**
 * @ngdoc directive
 * @name udb.entry.directive:udbWorkIndicator
 * @description
 * # udbWorkIndicator
 */
angular
  .module('udb.entry')
  .directive('udbWorkIndicator', udbWorkIndicator);

/* @ngInject */
function udbWorkIndicator ($window, jobLogger) {
  return {
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.working = false;

      $window.setInterval(function () {
        scope.working = jobLogger.hasUnfinishedJobs();
        element.toggleClass('working', scope.working);
      }, 2000);
    }
  };
}
