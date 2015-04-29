'use strict';

/**
 * @ngdoc directive
 * @name udb.export.directive:udbExportModalButtons
 * @description
 * # udbExportModalButtons
 */
angular
  .module('udb.export')
  .directive('udbExportModalButtons', udbExportModalButtons);

/* @ngInject */
function udbExportModalButtons() {
  return {
    templateUrl: 'templates/export-modal-buttons.directive.html',
    restrict: 'E'
  };
}
