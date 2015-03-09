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
function EventDetail($scope, $routeParams, $location, udbApi, jsonLDLangFilter, locationTypes) {
  $scope.eventId = $routeParams.eventId;
  $scope.eventIdIsInvalid = false;
  $scope.eventHistory = [];

  var eventLoaded = udbApi.getEventById($scope.eventId);

  eventLoaded.then(
      function (event) {
        var eventHistoryLoaded = udbApi.getEventHistoryById($scope.eventId);

        eventHistoryLoaded.then(function(eventHistory) {
          $scope.eventHistory = eventHistory;
        });
        $scope.event = jsonLDLangFilter(event, 'nl');

        $scope.eventIdIsInvalid = false;
      },
      function (reason) {
        $scope.eventIdIsInvalid = true;
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
      header: 'Gegevens'
    },
    {
      id: 'history',
      header: 'Historiek'
    },
    {
      id: 'publication',
      header: 'Publicatie'
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

  $scope.eventLocation = function (event) {
    var eventLocation = [
      event.location.name
    ];

    if (event.location.terms) {
      angular.forEach(event.location.terms, function (term) {
        // Only add terms related to locations.
        if (locationTypes.indexOf(term.id) !== -1) {
          eventLocation.push(term.label);
        }
      });
    }

    if (event.location.address.addressLocality) {
      eventLocation.push(event.location.address.addressLocality);
    }

    return eventLocation.join(', ');
  };

  $scope.eventIds = function (event) {
    return _.union([event.id], event.sameAs);
  };

  $scope.isUrl = function (potentialUrl) {
    return /^(https?)/.test(potentialUrl);
  };

  $scope.isTabActive = function (tabId) {
    return tabId === activeTabId;
  };
}
