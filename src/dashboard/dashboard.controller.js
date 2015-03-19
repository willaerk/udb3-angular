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
    $scope.loaded = false;
    $scope.userContent = null;
    $scope.noContent = true;

    // Scope functions.
    $scope.getUdb3ContentForCurrentUser = getUdb3ContentForCurrentUser;

    // Load the udb3 content for the current user.
    getUdb3ContentForCurrentUser();

    /**
     * function to get udb3 content for the current user.
     */
    function getUdb3ContentForCurrentUser() {

      var promise = udb3Content.getUdb3ContentForCurrentUser();
      return promise.then(function (content) {

        // Add data to scope and convert to array to allow ordering in ng-repeat.
        $scope.userContent = Object.keys(content.data.content).map(function(key) { return content.data.content[key]; });
        $scope.loaded = true;

        if ($scope.userContent.length) {

          // Set boolean if user has content
          $scope.noContent = false;

          // Loop through content to prepare data for html.
          for (var key in $scope.userContent) {
            var item = $scope.userContent[key];

            // set urls
            $scope.userContent[key].editUrl = '/udb3/' + item.type + '/' + item.id + '/edit';
            $scope.userContent[key].exampleUrl = '/udb3/' + item.type + '/' + item.id;
            $scope.userContent[key].deleteUrl = '/udb3/' + item.type + '/' + item.id + '/delete';
          }
        }
        else {
          // set boolean is user has no content.
          $scope.noContent = true;
        }
      });
    }
  }

})();
