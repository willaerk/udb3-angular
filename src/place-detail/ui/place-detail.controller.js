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
  ];

  var placeLoaded = udbApi.getPlaceById($scope.placeId);

  placeLoaded.then(
      function (place) {
        var placeHistoryLoaded = udbApi.getEventHistoryById($scope.placeId);

        placeHistoryLoaded.then(function(placeHistory) {
          $scope.placeHistory = placeHistory;
        });
        $scope.place = place;
        $scope.placeIdIsInvalid = false;
        $scope.place.omdEvent = false;

        if (typeof $scope.place.additionalData.omdInfo !== 'undefined') {
          $scope.place.omdEvent = true;

          $scope.tabs.push({
            id: 'omd',
            header: 'Open Monumentendag'
          });

          // Get category list.
          $scope.place.additionalData.omdInfo.categoryList = $scope.place.additionalData.omdInfo.categories.join(', ');

          // Get free brochure info.
          if ($scope.place.additionalData.omdInfo.brochure) {
            if ($scope.place.additionalData.omdInfo.freeBrochure) {
              $scope.place.additionalData.omdInfo.brochure = 'Ja, gratis';
            }
            else if ($scope.place.additionalData.omdInfo.priceBrochure) {
              $scope.place.additionalData.omdInfo.brochure = 'Ja, ' +
                $scope.place.additionalData.omdInfo.priceBrochure + ' €';
            }
            else {
              $scope.place.additionalData.omdInfo.brochure = 'Ja';
            }
          }
          else {
            $scope.place.additionalData.omdInfo.brochure = 'Nee';
          }

          // First time?
          if ($scope.place.additionalData.omdInfo.firstParticipation) {
            $scope.place.additionalData.omdInfo.firstParticipation = 'Ja';
          }
          else {
            $scope.place.additionalData.omdInfo.firstParticipation = 'Nee';
          }

          // Infopunt
          if ($scope.place.additionalData.omdInfo.hasInfoOffice) {
            $scope.place.additionalData.omdInfo.infoOffice = 'Ja';
          }
          else {
            $scope.place.additionalData.omdInfo.infoOffice = 'Nee';
          }

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
