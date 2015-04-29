'use strict';

/**
 * @ngdoc directive
 * @name udb.savedSearches.directive:udbSaveSearch
 * @description
 * # udbSaveSearch
 */
angular
  .module('udb.saved-searches')
  .directive('udbSaveSearch', udbSaveSearch);

/* @ngInject */
function udbSaveSearch(savedSearchesService, $modal) {
  var directive = {
    link: link,
    templateUrl: 'templates/save-search.directive.html',
    restrict: 'AE',
    scope: {
      queryString: '=udbQueryString'
    }
  };
  return directive;

  function link(scope, element, attrs, controllers) {
    scope.saveSearch = function () {
      var modal = $modal.open({
        templateUrl: 'templates/save-search-modal.html',
        controller: 'SaveSearchModalController'
      });

      modal.result.then(function (name) {
        savedSearchesService.createSavedSearch(name, scope.queryString);
      });
    };
  }
}
