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
function SavedSearchesList($scope, savedSearchesService) {

  $scope.savedSearches = [];

  $scope.editorOptions = {
    mode: 'solr',
    lineWrapping: true,
    readOnly: true
  };

  $scope.codemirrorLoaded = function(editorInstance) {
    editorInstance.on('focus', function () {
      editorInstance.execCommand('selectAll');
    });
  };

  var savedSearchesPromise = savedSearchesService.getSavedSearches();

  savedSearchesPromise.then(function (savedSearches) {
    $scope.savedSearches = savedSearches;
  });
}
