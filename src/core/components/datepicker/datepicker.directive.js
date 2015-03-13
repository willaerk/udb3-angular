(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name udb.core.directive:udbDatepicker
   * @description
   * # directive for datepicker integration
   */
  angular
  .module('udb.core')
  .directive('udbDatepicker', udbDatepickerDirective);

  function udbDatepickerDirective() {

    var datepicker = {
      restrict: 'A',
      require: 'ngModel',
      link: function (scope, elem, attrs, ngModel) {

        var options = {
        format: 'd MM yyyy',
           language: 'nl-BE',
           beforeShowDay: function(date) {
             var dateFormat = date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
             if (attrs.highlightDate && dateFormat === attrs.highlightDate) {
               return {classes: 'highlight'};
             }
           }
        };
        elem.datepicker(options).on('changeDate', function(e) {
          ngModel.$setViewValue(e.date);
        });
      }
    };

    return datepicker;

  }

})();
