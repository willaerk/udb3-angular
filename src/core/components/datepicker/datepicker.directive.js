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

        var isLoaded = false;

        // Default date given: wait till angular fills in the value before loading.
        if (attrs.date) {
          attrs.$observe('date', function(value) {
            if (!isLoaded) {
              loadDatePicker();
            }
          });
        }
        // No default date, load immediately.
        else {
          loadDatePicker();
        }

        /**
         * Load the date picker.
         */
        function loadDatePicker() {

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

          isLoaded = true;
        }

      }
    };

    return datepicker;

  }

})();
