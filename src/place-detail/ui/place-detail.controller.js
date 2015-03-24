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

        if (typeof $scope.place.additionalData.omdInfo !== 'undefined') {
          $scope.place.omdParticipation = true;

          // Get category list.
          $scope.place.categoryList = $scope.place.additionalData.omdInfo.categories.join(', ');

          // Get free brochure info.
          if ($scope.place.additionalData.omdInfo.freeBrochure === true) {
            $scope.place.freeBrochure = 'Ja';
          }
          else {
            $scope.place.freeBrochure = 'Nee';
          }
        }
        else {
          $scope.place.omdParticipation = false;
        }
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

    if (place.address.addressLocality) {
      return place.address.addressLocality;
    }

    return '';
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
