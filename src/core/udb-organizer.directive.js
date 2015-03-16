'use strict';

/**
 * @ngdoc directive
 * @name udb.core.directive:udbOrganizer
 * @description
 * # udbOrganizer
 */
angular
  .module('udb.core')
  .directive('udbOrganizer', udbOrganizer);

/* @ngInject */
function udbOrganizer(udbApi) {
  var event = {
    restrict: 'A',
    link: function postLink(scope, iElement, iAttrs) {

      // The organizer object that's returned from the server
      var organizer;

      if (!scope.organizer.title) {
        scope.fetching = true;
        var promise = udbApi.getOrganizerByLDId(scope.organizer.id);

        promise.then(function (organizerObject) {
          scope.organizer = organizerObject;
          scope.fetching = false;
        });
      } else {
        scope.fetching = false;
      }

    }
  };

  return event;
}
