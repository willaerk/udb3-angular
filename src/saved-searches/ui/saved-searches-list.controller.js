'use strict';

/**
 * @ngdoc function
 * @name udb.saved-searches-list.controller:SavedSearchesListController
 * @description
 * # SavedSearchesListController
 * Saved searches list controller
 */
angular
  .module('udb.saved-searches')
  .controller('SavedSearchesListController', SavedSearchesList);

/* @ngInject */
function SavedSearchesList($scope) {

  $scope.savedSearches =
    [
      {
        id: 118,
        name: 'In Leuven',
        query: 'city:\u0022leuven\u0022'
      },
      {
        id: 119,
        name: 'In Herent',
        query: 'city:\u0022Herent\u0022'
      }
    ];
}
