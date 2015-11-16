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
    var deferredOrganizer = $q.defer();

    function returnOrganizerSuggestions(pagedOrganizersResponse) {
      deferredOrganizer.resolve(pagedOrganizersResponse.data.member);
    }

    $http
      .get(appConfig.baseApiUrl + 'organizer/suggest/' + value)
      .then(returnOrganizerSuggestions);

    return deferredOrganizer.promise;
  };

  /**
   * Search for duplicate organizers.
   */
  this.searchDuplicates = function(title, postalCode) {

    var duplicates = $q.defer();

    var request = $http.get(
      appConfig.baseApiUrl + 'organizer/search-duplicates/' + title + '?postalcode=' + postalCode
    );

    request.success(function(jsonData) {
      duplicates.resolve(jsonData);
    });

    return duplicates.promise;

  };

}
