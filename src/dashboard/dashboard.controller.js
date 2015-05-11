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
    $scope.userContent = null;
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

      $scope.userContent = [];

      var promise = udb3Content.getUdb3ContentForCurrentUser();
      return promise.then(function (content) {

        if (content.data.content && content.data.content.length > 0) {

          // Loop through content to prepare data for html.
          for (var key in content.data.content) {

            var type = content.data.content[key].type;
            var item = {
              type : type
            };
            if (type === 'event') {
              item.details = new UdbEvent();
              item.details.parseJson(content.data.content[key]);
              item.details = jsonLDLangFilter(item.details, 'nl');
            }
            else if (content.data.content[key].type === 'place') {
              item.details = new UdbPlace();
              item.details.parseJson(content.data.content[key]);
            }

            if (!item.details) {
              continue;
            }

            // set urls
            item.editUrl = '/udb3/' + type + '/' + item.details.id + '/edit';
            item.exampleUrl = '/udb3/' + type + '/' + item.details.id;

            $scope.userContent[key] = item;
          }

          $scope.loaded = true;

        }
        else {
          $scope.loaded = true;
        }

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
              return item;
            }
          }
        });
        modalInstance.result.then(function (item) {
          removeItem(item);
        }, function () {
        });

      }
      else {

        // Check if this place has planned events.
        var hasEvents = true;
        var promise = eventCrud.findEventsForLocation(item.details.id);
        promise.then(function(jsonResponse) {
          hasEvents = jsonResponse.data.events !== undefined;

          modalInstance = $modal.open({
            templateUrl: 'templates/place-delete-confirm-modal.html',
            controller: 'PlaceDeleteConfirmModalCtrl',
            resolve: {
              item: function () {
                return item;
              },
              hasEvents: function () {
                return hasEvents;
              }
            }
          });
          modalInstance.result.then(function (item) {
            console.log('Modal dismissed. Removing item');
            removeItem(item);
          }, function () {
          });


        }, function(error) {
          hasEvents = false;
        });

      }

    }

    /**
     * Open the confirmation modal to delete an event/place.
     */
    function removeItem(item) {
      console.log(item);
      $scope.userContent.splice( $scope.userContent.indexOf(item), 1 );
    }

  }

})();
