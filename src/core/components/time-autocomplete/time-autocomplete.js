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
  .directive('udbTimeAutocomplete', udbTimeAutocompleteDirective);

  function udbTimeAutocompleteDirective() {

    return {
      restrict: 'E',
      require: 'ngModel',
      scope : {
        ngModel : '=',
        cssClass : '@',
        inputPlaceholder : '@'
      },
      templateUrl: 'templates/time-autocomplete.html',
      link: function(scope, elem, attrs, ngModel) {
        scope.times = generateTimes();
      },

    };

    /**
     * Generate the time options.
     */
    function generateTimes() {

      var increment = 15;
      var date = new Date(2015, 1, 1, 0, 0);
      var options = [];
      var hourLen = 60;
      var hours = 24;

      for (var i = 0, loopInt = hours * (hourLen / increment); i < loopInt; i++) {

        date.setMinutes(date.getMinutes() + increment);
        var h = date.getHours();
        var m = date.getMinutes();

        if (('' + h).length === 1) {
          h = '0' + h;
        }

        if (('' + m).length === 1) {
          m = '0' + m;
        }

        var label = h + ':' + m;
        options.push(label);
      }

      return options;

    }

  }

})();
