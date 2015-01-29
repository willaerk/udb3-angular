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
        editQuery: function () {
          $rootScope.$emit('editQuery');
        }
      };

      scope.sb = searchBar;

      scope.$watch('sb.query', function (queryString) {
        searchHelper.setQueryString(queryString);
      });

      scope.$watch(function () {
        return searchHelper.getQuery();
      }, function (query) {
        scope.sb.query = query.queryString;

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