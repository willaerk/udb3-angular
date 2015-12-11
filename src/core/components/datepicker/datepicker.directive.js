(function () {
  'use strict';

  /**
   * @ngdoc directive
   * @name udb.core.directive:udbDatepicker
   * @description
   * # directive for datepicker integration.
   * https://github.com/eternicode/bootstrap-datepicker
   */
  angular
  .module('udb.core')
  .directive('udbDatepicker', udbDatepickerDirective);

  function udbDatepickerDirective() {

    return {
      restrict: 'EA',
      require: 'ngModel',
      link: link
    };

    function link (scope, elem, attrs, ngModel) {

      loadDatePicker();

      ngModel.$render = function () {
        elem.datepicker('update', ngModel.$viewValue);
      };

      /**
       * Load the date picker.
       */
      function loadDatePicker() {

        var options = {
          format: 'd MM yyyy',
          language: 'nl-BE',
          startDate: new Date(),
          beforeShowDay: function (date) {
            var dateFormat = date.getUTCFullYear() + '-' + date.getUTCMonth() + '-' + date.getUTCDate();
            if (attrs.highlightDate && dateFormat === attrs.highlightDate) {
              return {classes: 'highlight'};
            }
          }
        };

        elem.datepicker(options).on('changeDate', function (newValue) {
          if (!ngModel.$viewValue || ngModel.$viewValue.getTime() !== newValue.date.getTime()) {
            ngModel.$setViewValue(newValue.date);
          }
        });
      }
    }
  }
})();
