'use strict';

/**
 * @ngdoc service
 * @name udb.search.searchHelper
 * @description
 * # searchHelper
 * Service in the udb.search.
 */
angular
  .module('udb.search')
  .service('searchHelper', SearchHelper);

/* @ngInject */
function SearchHelper(LuceneQueryBuilder, $rootScope) {
  var query = {
    queryString: ''
  };
  var queryTree = null;

  this.clearQueryTree = function () {
    queryTree = null;
  };

  this.setQueryString = function (queryString) {
    if (query.queryString !== queryString) {
      var newQuery = LuceneQueryBuilder.createQuery(queryString);
      LuceneQueryBuilder.isValid(newQuery);
      this.setQuery(newQuery);
      queryTree = null;
    }
  };

  this.setQueryTree = function (groupedQueryTree) {
    var queryString = LuceneQueryBuilder.unparseGroupedTree(groupedQueryTree);
    var newQuery = LuceneQueryBuilder.createQuery(queryString);
    LuceneQueryBuilder.isValid(newQuery);
    this.setQuery(newQuery);

    queryTree = groupedQueryTree;
  };

  this.setQuery = function (searchQuery) {
    query = searchQuery;
    $rootScope.$emit('searchQueryChanged', searchQuery);
  };

  this.getQuery = function () {
    return query;
  };

  this.getQueryTree = function () {
    return angular.copy(queryTree);
  };
}
