'use strict';

/**
 * @ngdoc function
 * @name udb.event-detail.controller:EventDetailController
 * @description
 * # EventDetailController
 * Event Detail controller
 */
angular
    .module('udb.event-detail')
    .controller('EventDetailController', EventDetail);

/* @ngInject */
function EventDetail($scope, $routeParams) {
  $scope.eventId = $routeParams.eventId;
}
