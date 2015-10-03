(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:DashboardCtrl
   * @description
   * # DashboardCtrl
   * dashboard
   */
  angular
    .module('udb.dashboard')
    .controller('DashboardCtrl', DashboardController);

  /* @ngInject */
  function DashboardController($scope, $modal, udb3Content, eventCrud, UdbEvent, UdbPlace, jsonLDLangFilter) {

    // Scope variables.
    $scope.loaded = false;
    $scope.userContent = [];
    $scope.noContent = true;

    // Scope functions.
    $scope.getUdb3ContentForCurrentUser = getUdb3ContentForCurrentUser;
    $scope.openDeleteConfirmModal = openDeleteConfirmModal;

    // Load the udb3 content for the current user.
    getUdb3ContentForCurrentUser();

    /**
     * function to get udb3 content for the current user.
     */
    function getUdb3ContentForCurrentUser() {
      udb3Content.getUdb3ContentForCurrentUser().then(function (content) {
        $scope.userContent = [];

        if (content.member && content.member.length > 0) {
          angular.forEach(content.member, function (jsonld) {
            var type = jsonld.type;
            var item = {
              type : type
            };

            switch (type) {
              case 'event':
                item.details = new UdbEvent();
                item.details.parseJson(jsonld);
                item.details = jsonLDLangFilter(item.details, 'nl');
                break;

              case 'place':
                item.details = new UdbPlace();
                item.details.parseJson(jsonld);
                break;

              default:
                return;
            }

            item.editUrl = '/udb3/' + type + '/' + item.details.id + '/edit';
            item.exampleUrl = '/udb3/' + type + '/' + item.details.id;

            $scope.userContent.push(item);
          });
        }

        $scope.loaded = true;
      });
    }

    /**
     * Open the confirmation modal to delete an event/place.
     */
    function openDeleteConfirmModal(item) {

      var modalInstance = null;

      if (item.type === 'event') {

        modalInstance = $modal.open({
          templateUrl: 'templates/event-delete-confirm-modal.html',
          controller: 'EventDeleteConfirmModalCtrl',
          resolve: {
            item: function () {
              return item.details;
            }
          }
        });
        modalInstance.result.then(function (item) {
          removeItem(item);
        });

      }
      else {

        // Check if this place has planned events.
        var promise = eventCrud.findEventsForLocation(item.details.id);
        promise.then(function(jsonResponse) {

          modalInstance = $modal.open({
            templateUrl: 'templates/place-delete-confirm-modal.html',
            controller: 'PlaceDeleteConfirmModalCtrl',
            resolve: {
              item: function () {
                return item.details;
              },
              events: function () {
                return jsonResponse.data.events;
              }
            }
          });
          modalInstance.result.then(function (item) {
            removeItem(item);
          });

        });

      }

    }

    /**
     * Open the confirmation modal to delete an event/place.
     */
    function removeItem(item) {
      var i = 0;
      for (; i < $scope.userContent.length; i++) {
        if ($scope.userContent[i].details.id === item.id) {
          break;
        }
      }
      $scope.userContent.splice(i, 1);
    }

  }

})();
