'use strict';

/**
 * @ngdoc directive
 * @name udb.search.directive:udbSearchBar
 * @description
 * # udbSearchBar
 */
angular
  .module('udb.search')
  .directive('udbSearchBar', udbSearchBar);

/* @ngInject */
function udbSearchBar(searchHelper, $rootScope, $uibModal, savedSearchesService) {
  return {
    templateUrl: 'templates/search-bar.directive.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      var searchBar = {
        query: '',
        hasErrors: false,
        errors: '',
        isEditing: false,
        savedSearches: []
      };

      var editorModal;

      searchBar.editQuery = function () {
        $rootScope.$emit('startEditingQuery');
        searchBar.isEditing = true;

        editorModal = $uibModal.open({
          templateUrl: 'templates/query-editor-modal.html',
          controller: 'QueryEditorController',
          controllerAs: 'qe',
          size: 'lg'
        });
      };

      searchBar.searchChange = function() {
        searchHelper.clearQueryTree();
        $rootScope.$emit('searchBarChanged');
        $rootScope.$emit('stopEditingQuery');
      };

      searchBar.search = function () {
        searchHelper.setQueryString(searchBar.query);
        $rootScope.$emit('searchSubmitted');
      };

      scope.sb = searchBar;

      var savedSearchesPromise = savedSearchesService.getSavedSearches();
      savedSearchesPromise.then(function (savedSearches) {
        searchBar.savedSearches = _.take(savedSearches, 5);
      });
      $rootScope.$on('savedSearchesChanged', function (event, savedSearches) {
        searchBar.savedSearches = _.take(savedSearches, 5);
      });

      $rootScope.$on('stopEditingQuery', function () {
        scope.sb.isEditing = false;
        if (editorModal) {
          editorModal.dismiss();
        }
      });

      scope.$watch(function () {
        return searchHelper.getQuery();
      }, function (query, oldQuery) {
        if (oldQuery && oldQuery.queryString !== query.queryString) {
          scope.sb.query = query.queryString;
          scope.sb.search();

          if (query.errors && query.errors.length) {
            scope.sb.hasErrors = true;
            scope.sb.errors = formatErrors(query.errors);
          } else {
            scope.sb.hasErrors = false;
            scope.sb.errors = '';
          }
        }
      }, true);

      function formatErrors(errors) {
        var formattedErrors = '';

        _.forEach(errors, function (error) {
          formattedErrors += (error + '\n');
        });

        return formattedErrors;
      }
    }
  };
}
