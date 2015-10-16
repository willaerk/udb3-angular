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
function SearchHelper(LuceneQueryBuilder) {
  var query = {
    queryString: ''
  };
  var queryTree = null;

  this.setQueryString = function (queryString) {
    if (query.queryString !== queryString) {
      query = LuceneQueryBuilder.createQuery(queryString);
      LuceneQueryBuilder.isValid(query);
      queryTree = null;
    }

    return query;
  };

  this.setQueryTree = function (groupedQueryTree) {
    var queryString = LuceneQueryBuilder.unparseGroupedTree(groupedQueryTree);
    query = LuceneQueryBuilder.createQuery(queryString);
    LuceneQueryBuilder.isValid(query);

    queryTree = groupedQueryTree;
  };

  this.setQuery = function (searchQuery) {
    query = searchQuery;
  };

  this.getQuery = function () {
    return query;
  };

  this.getQueryTree = function () {
    return angular.copy(queryTree);
  };
}
