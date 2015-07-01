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
function SavedSearchesService($q, $http, appConfig, $rootScope) {
  var apiUrl = appConfig.baseUrl;
  var defaultApiConfig = {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  var savedSearches = [];
  var ss = this;

  ss.createSavedSearch = function(name, query) {
    var post = {
      name: name,
      query: query
    };
    var request = $http.post(apiUrl + 'saved-searches/', post, defaultApiConfig);

    request.success(function () {
      savedSearches.push(post);
      savedSearchesChanged();
    });

    return request;
  };

  ss.getSavedSearches = function () {
    var deferredSavedSearches = $q.defer();
    var savedSearchesRequest = $http.get(apiUrl + 'saved-searches/', {withCredentials: true});

    savedSearchesRequest.success(function (data) {
      deferredSavedSearches.resolve(data);
      savedSearches = data;
    });

    return deferredSavedSearches.promise;
  };

  ss.deleteSavedSearch = function (searchId) {
    var request = $http.delete(apiUrl + 'saved-searches/' + searchId, defaultApiConfig);

    request.success(function () {
      _.remove(savedSearches, {id: searchId});
      savedSearchesChanged();
    });

    return request;
  };

  function savedSearchesChanged () {
    $rootScope.$emit('savedSearchesChanged', savedSearches);
  }
}

