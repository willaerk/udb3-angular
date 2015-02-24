(function () {
  'use strict';

/**
 * @ngdoc directive
 * @name udb.core.directive:udbMultiselect
 * @description
 * # directive for bootstrap-multiselect integration
 */
angular
  .module('udb.core')
  .directive('udbMultiselect', udbMultiselectDirective);

  function udbMultiselectDirective() {

    return {
      restrict: 'A',
      link: function (scope, elem, attrs, ngModel) {

        elem.multiselect({
          buttonText: function(options, select) {
            if (options.length > 0) {
              var labels = [];
              options.each(function() {
                labels.push(angular.element(this).html().substring(0,2));
              });
              return labels.join(', ') + ' ';
            }
            else {
              return attrs.startLabel;
            }
          }
       });
      }

    };
  }

})();