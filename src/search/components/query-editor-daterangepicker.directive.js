'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbQueryEditorDaterangepicker
 * @description
 * # udbQueryEditorDaterangepicker
 */
angular
  .module('udb.search')
  .directive('udbQueryEditorDaterangepicker', udbQueryEditorDaterangepicker);

/* @ngInject */
function udbQueryEditorDaterangepicker($translate, uibDatepickerPopupConfig) {
  return {
    templateUrl: 'templates/query-editor-daterangepicker.directive.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      var dateRangePicker = {
        startOpened: false,
        endOpened: false,
        dateFormat: 'dd/MM/yyyy'
      };

      $translate(['datepicker.CURRENT', 'datepicker.CLEAR', 'datepicker.CLOSE']).then(function (translations) {
        uibDatepickerPopupConfig.currentText = translations['datepicker.CURRENT'];
        uibDatepickerPopupConfig.clearText = translations['datepicker.CLEAR'];
        uibDatepickerPopupConfig.closeText = translations['datepicker.CLOSE'];
      });

      dateRangePicker.openStart = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        dateRangePicker.startOpened = true;
        dateRangePicker.endOpened = false;
      };

      dateRangePicker.openEnd = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        dateRangePicker.startOpened = false;
        dateRangePicker.endOpened = true;
      };

      scope.drp = dateRangePicker;
    }
  };
}

angular
  .module('udb.search')
  .directive('datepickerPopup', datepickerPopup);

/* @ngInject */
function datepickerPopup() {
  return {
    restrict: 'EAC',
    require: 'ngModel',
    link: function (scope, element, attr, controller) {
      //remove the default formatter from the input directive to prevent conflict
      controller.$formatters.shift();
    }
  };
}
