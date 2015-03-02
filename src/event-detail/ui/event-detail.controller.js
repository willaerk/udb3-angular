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
function EventDetail($scope, $routeParams, $location, udbApi, jsonLDLangFilter) {
  $scope.eventId = $routeParams.eventId;

  var eventLoaded = udbApi.getEventById($scope.eventId);

  eventLoaded.then(
      function (event) {
        console.log(event);

        $scope.event = jsonLDLangFilter(event, 'nl');
        console.log($scope.event);
      },
      function (reason) {
        console.log('loading event failed');
      }
  );

  var getActiveTabId = function() {
    var hash = $location.hash();

    if (hash) {
      return hash;
    }
    else {
      return 'data';
    }
  };

  var activeTabId = getActiveTabId();

  $scope.tabs = [
    {
      id: 'data',
      header: 'Gegevens',
      active: false
    },
    {
      id: 'history',
      header: 'Historiek',
      active: false
    },
    {
      id: 'publication',
      header: 'Publicatie',
      active: false
    }
  ];

  $scope.classForTab = function (tab) {
    if (tab.id === activeTabId) {
      return 'active';
    }
  };

  $scope.$on('$locationChangeSuccess', function () {
    activeTabId = getActiveTabId();
  });
}
