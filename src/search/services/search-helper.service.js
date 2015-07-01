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

  this.setQueryString = function (queryString) {
    query = LuceneQueryBuilder.createQuery(queryString);
    LuceneQueryBuilder.isValid(query);

    return query;
  };

  this.setQuery = function (searchQuery) {
    query = searchQuery;
  };

  this.getQuery = function () {
    return query;
  };
}