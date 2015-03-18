'use strict';

/**
 * @ngdoc function
 * @name udb.place-detail.controller:PlaceDetailController
 * @description
 * # PlaceDetailController
 * Place Detail controller
 */
angular
    .module('udb.place-detail')
    .controller('PlaceDetailController', PlaceDetail);

/* @ngInject */
function PlaceDetail($scope, $location, placeId, udbApi, jsonLDLangFilter, locationTypes) {

  $scope.placeId = placeId;
  $scope.placeIdIsInvalid = false;
  $scope.placeHistory = [];

  var placeLoaded = udbApi.getPlaceById($scope.placeId);

  placeLoaded.then(
      function (place) {
        var placeHistoryLoaded = udbApi.getEventHistoryById($scope.placeId);

        placeHistoryLoaded.then(function(placeHistory) {
          $scope.placeHistory = placeHistory;
        });
        $scope.place = place;
        $scope.placeIdIsInvalid = false;
      },
      function (reason) {
        $scope.placeIdIsInvalid = true;
      }
  );

  var getActiveTabId = function() {
    var hash = $location.hash();

    if (hash) {
      return hash;
    }
    else {
      return 'omd';
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
    },
    {
      id: 'omd',
      header: 'Open Monumenten Dag'
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

  $scope.placeLocation = function (place) {
    var placeLocation = [
      place.location.name
    ];

    if (place.location.terms) {
      angular.forEach(place.location.terms, function (term) {
        // Only add terms related to locations.
        if (locationTypes.indexOf(term.id) !== -1) {
          placeLocation.push(term.label);
        }
      });
    }

    if (place.location.address.addressLocality) {
      placeLocation.push(place.location.address.addressLocality);
    }

    return placeLocation.join(', ');
  };

  $scope.placeIds = function (place) {
    return _.union([place.id], place.sameAs);
  };

  $scope.isUrl = function (potentialUrl) {
    return /^(https?)/.test(potentialUrl);
  };

  $scope.isTabActive = function (tabId) {
    return tabId === activeTabId;
  };
}
