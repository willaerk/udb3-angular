(function () {
  'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:event-form.html
 * @description
 * # udb event form directive
 */
angular
  .module('udb.event-form')
  .directive('udbDatepicker', udbDatepickerDirective);

  function udbDatepickerDirective() {

    var datepicker = {
      restrict: 'A',
      link: function (scope, elem, attrs) {

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
        elem.datepicker(options);
      }
    };

    return datepicker;

  }

})();