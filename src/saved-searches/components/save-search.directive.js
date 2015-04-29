'use strict';

/**
 * @ngdoc directive
 * @name udb.savedSearches.directive:udbSaveSearch
 * @description
 * # udbSaveSearch
 */
angular
  .module('udb.saved-searches', ['udb.search'])
  .directive('udbSaveSearch', udbSaveSearch);

/* @ngInject */
function udbSaveSearch(savedSearchesService) {
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
      console.log('saving your search: ' + scope.queryString);
    };
  }
}
