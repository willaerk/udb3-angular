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
function udbSearchBar(searchHelper, $rootScope) {
  return {
    templateUrl: 'templates/search-bar.directive.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {

      var searchBar = {
        query: '',
        hasErrors: false,
        errors: '',
        isEditing: false
      };

      searchBar.editQuery = function () {
        var query = searchHelper.setQueryString(searchBar.query);

        if(query.errors && !query.errors.length) {
          $rootScope.$emit('startEditingQuery');
          searchBar.isEditing = true;
        }
      };

      searchBar.search = function () {
        searchHelper.setQueryString(searchBar.query);
      };

      scope.sb = searchBar;

      $rootScope.$on('stopEditingQuery', function () {
        scope.sb.isEditing = false;
      });

      scope.$watch(function () {
        return searchHelper.getQuery();
      }, function (query) {
        scope.sb.query = query.queryString;
        scope.sb.search();

        if (query.errors && query.errors.length) {
          scope.sb.hasErrors = true;
          scope.sb.errors = formatErrors(query.errors);
        } else {
          scope.sb.hasErrors = false;
          scope.sb.errors = '';
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