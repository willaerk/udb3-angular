'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbEventFormSaveTimeTracker
 * @description
 * Tracks the time of when an event form was last saved.
 */
angular
  .module('udb.event-form')
  .directive('udbEventFormSaveTimeTracker', TimeTrackerDirective);

/* @ngInject */
function TimeTrackerDirective($rootScope) {

  var template =
    '<div class="save-time-tracker small" ng-if="::timeLastSaved">' +
    '  Automatisch bewaard om <span class="time-last-saved" ng-bind="timeLastSaved | date:\'HH:mm\'"></span> uur' +
    '</div>';

  return {
    template: template,
    restrict: 'EA',
    link: link
  };

  function link(scope) {
    scope.timeLastSaved = undefined;

    function refreshTimeLastSaved() {
      scope.timeLastSaved = new Date();
    }

    var eventFormSavedListener = $rootScope.$on('eventFormSaved', refreshTimeLastSaved);
    scope.$on('$destroy', eventFormSavedListener);
  }
}
