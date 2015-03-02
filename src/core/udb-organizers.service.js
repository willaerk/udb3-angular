'use strict';

/**
 * @ngdoc service
 * @name udb.core.organizers
 * @description
 * Service for organizers.
 */
angular
  .module('udb.core')
  .service('udbOrganizers', UdbOrganizers);

/* @ngInject */
function UdbOrganizers($q, $http, appConfig) {

  /**
   * Get the organizers that match the searched value.
   */
  this.suggestOrganizers = function(value) {

    var organizers = $q.defer();

    var request = $http.get(appConfig.baseApiUrl + 'organizer/suggest/' + value);

    request.success(function(jsonData) {
      organizers.resolve(jsonData);
    });

    return organizers.promise;

  };

  /**
   * Search for duplicate organizers.
   */
  this.searchDuplicates = function(title, zip) {

    var duplicates = $q.defer();

    var request = $http.get(appConfig.baseApiUrl + 'organizer/search-duplicates/' + title + '/' + zip);

    request.success(function(jsonData) {
      duplicates.resolve(jsonData);
    });

    return duplicates.promise;

  };

}
