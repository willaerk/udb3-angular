'use strict';

/**
 * @ngdoc directive
 * @name udb.entry.directive:jobLogo
 * @description
 * # udbJobLogo
 */
angular
  .module('udb.entry')
  .directive('udbJobLogo', udbJobLogo);

/* @ngInject */
function udbJobLogo() {
  var directive = {
    templateUrl: 'templates/job-logo.directive.html',
    restrict: 'EA',
    link: link,
    controllerAs: 'jl',
    controller: 'JobLogoController'
  };
  return directive;

  function link(scope, element, attrs) {
  }
}
