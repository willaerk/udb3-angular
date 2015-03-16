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
  function DashboardController($scope, udb3Content) {

    // Scope variables.
    $scope.userContent = null;
    $scope.noContent = true;
    $scope.noOmdEvents = true;

    // Scope functions.
    $scope.getUdb3ContentForCurrentUser = getUdb3ContentForCurrentUser;
    $scope.getNoOmdEventsMessage = getNoOmdEventsMessage;

    // Load the udb3 content for the current user.
    getUdb3ContentForCurrentUser();
    getNoOmdEventsMessage();

    /**
     * function to get udb3 content for the current user.
     */
    function getUdb3ContentForCurrentUser() {

      var promise = udb3Content.getUdb3ContentForCurrentUser();
      return promise.then(function (content) {

        // Add data to scope and convert to array to allow ordering in ng-repeat.
        $scope.userContent = Object.keys(content.data.content).map(function(key) { return content.data.content[key]; });

        if ($scope.userContent.length) {

          // Set boolean if user has content
          $scope.noContent = false;

          // Loop through content to prepare data for html.
          for (var key in $scope.userContent) {
            var item = $scope.userContent[key];

            // set urls
            $scope.userContent[key].editUrl = '/udb3/' + item.type + '/edit/' + item.id;
            $scope.userContent[key].exampleUrl = '/udb3/' + item.type + '/' + item.id;
            $scope.userContent[key].deleteUrl = '/udb3/' + item.type + '/delete/' + item.id;

            // User has omd events if events have been added with startdate 2015-09-13.
            var startDate = item.details.payload.calendar.startDate.substring(0, 10);
            if (item.type === 'event' && startDate === '2015-09-13') {
              $scope.noOmdEvents = false;
            }
          }
        }
        else {
          // set boolean is user has no content.
          $scope.noContent = true;
        }
      });
    }

    /**
     * function to get the message when no omd events have been added by the user.
     */
    function getNoOmdEventsMessage() {

      var promise = udb3Content.getNoOmdEventsMessage();
      return promise.then(function (message) {
        $scope.noEventsMessage = message.data;
      });

    }
  }

})();
