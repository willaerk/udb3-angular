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

      /**
       * Search with a given query string and update the search bar or use the one currently displayed in the search bar
       *
       * @param {String} [queryString]
       */
      searchBar.find = function (queryString) {
        searchBar.query = typeof queryString !== 'undefined' ? queryString : searchBar.query;

        searchHelper.setQueryString(searchBar.query);
        $rootScope.$emit('searchSubmitted');
        searchBar.queryChanged();
      };

      /**
       * Notify other components that the search bar has changed and editing has stopped
       */
      searchBar.queryChanged = function() {
        $rootScope.$emit('searchBarChanged');
        $rootScope.$emit('stopEditingQuery');
      };

      scope.sb = searchBar;

      scope.$watch(function () {
        return searchHelper.getQuery();
      }, function (query, oldQuery) {
        if (oldQuery && oldQuery.queryString !== query.queryString) {
          scope.sb.find(query.queryString);

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

      /**
       * Show the first 5 items from a list of saved searches.
       *
       * @param {Object[]} savedSearches
       */
      function showSavedSearches(savedSearches) {
        searchBar.savedSearches = _.take(savedSearches, 5);
      }

      savedSearchesService
        .getSavedSearches()
        .then(showSavedSearches);

      var savedSearchesChangedListener = $rootScope.$on('savedSearchesChanged', function (event, savedSearches) {
        showSavedSearches(savedSearches);
      });

      var stopEditingQueryListener = $rootScope.$on('stopEditingQuery', function () {
        scope.sb.isEditing = false;
        if (editorModal) {
          editorModal.dismiss();
        }
      });

      scope.$on('$destroy', savedSearchesChangedListener);
      scope.$on('$destroy', stopEditingQueryListener);
    }
  };
}
