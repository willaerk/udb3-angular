'use strict';

/**
 * @ngdoc service
 * @name udb.saved-searches.savedSearchesService
 * @description
 * # savedSearchesService
 * Service in udb.saved-searches.
 */
angular
  .module('udb.saved-searches')
  .service('savedSearchesService', SavedSearchesService);

/* @ngInject */
function SavedSearchesService($q, $http, appConfig) {
  var apiUrl = appConfig.baseUrl;
  var defaultApiConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  this.createSavedSearch = function(name, query) {
    var post = {
      name: name,
      query: query
    };
    return $http.post(apiUrl + 'saved-searches/', post, defaultApiConfig);
  };

  this.getSavedSearches = function () {
    var deferredSavedSearches = $q.defer(),
        savedSearchesRequest = $http.get(apiUrl + 'saved-searches/', defaultApiConfig);

    savedSearchesRequest.success(function (data) {
      deferredSavedSearches.resolve(data);
    });

    return deferredSavedSearches.promise;
  };

  this.deleteSavedSearch = function (searchId) {
    return $http.delete(apiUrl + 'saved-searches/' + searchId, defaultApiConfig);
  };
}
