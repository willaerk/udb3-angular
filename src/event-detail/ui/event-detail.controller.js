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
function EventDetail(
  $scope,
  eventId,
  udbApi,
  jsonLDLangFilter,
  locationTypes,
  variationRepository,
  eventEditor
) {
  var activeTabId = 'data';

  $scope.eventId = eventId;
  $scope.eventIdIsInvalid = false;
  $scope.hasEditPermissions = false;
  $scope.eventHistory = [];
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

  // Check if user has permissions.
  udbApi.hasPermission(eventId).then(function(result) {
    $scope.hasEditPermissions = result.data.hasPermission;
  });

  var eventLoaded = udbApi.getEventById($scope.eventId);
  var language = 'nl';
  var cachedEvent;

  eventLoaded.then(
      function (event) {
        cachedEvent = event;

        var eventHistoryLoaded = udbApi.getEventHistoryById($scope.eventId);
        var personalVariationLoaded = variationRepository.getPersonalVariation(event);

        eventHistoryLoaded.then(function(eventHistory) {
          $scope.eventHistory = eventHistory;
        });

        $scope.event = jsonLDLangFilter(event, language);

        $scope.eventIdIsInvalid = false;

        personalVariationLoaded
          .then(function (variation) {
            $scope.event.description = variation.description[language];
          })
          .finally(function () {
            $scope.eventIsEditable = true;
          });
      },
      function (reason) {
        $scope.eventIdIsInvalid = true;
      }
  );

  var getActiveTabId = function() {
    return activeTabId;
  };

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

  $scope.updateDescription = function(description) {
    if ($scope.event.description !== description) {
      var updatePromise = eventEditor.editDescription(cachedEvent, description);

      updatePromise.finally(function () {
        if (!description) {
          $scope.event.description = cachedEvent.description[language];
        }
      });

      return updatePromise;
    }
  };

  $scope.makeTabActive = function (tabId) {
    activeTabId = tabId;
  };
}
