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
  function DashboardController($scope, udb3Content, UdbEvent, UdbPlace, jsonLDLangFilter) {

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
            item.deleteUrl = '/udb3/' + type + '/' + item.details.id + '/delete';

            $scope.userContent[key] = item;
          }

          $scope.loaded = true;

        }

      });
    }
  }

})();
