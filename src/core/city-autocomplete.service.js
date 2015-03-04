'use strict';

/**
 * @ngdoc service
 * @name udb.core.CityAutocomplete
 * @description
 * Service for city autocompletes.
 */
angular
  .module('udb.core')
  .service('cityAutocomplete', CityAutocomplete);

/* @ngInject */
function CityAutocomplete($q, $http, appConfig) {

  /**
   * Get the cities that match the searched value.
   */

  this.getCities = function(value) {

    var cities = $q.defer();

    var request = $http.get(appConfig.baseApiUrl + 'city/suggest/' + value);

    request.success(function(jsonData) {
      cities.resolve(jsonData);

    });

    return cities.promise;

  };

  /**
   *
   * Get the locations for a city
   *
   * @param {type} value
   * @returns {$q@call;defer.promise}
   */
  this.getLocationsForCity = function(value, postal) {

    var locations = $q.defer();

    var request = $http.get(appConfig.baseApiUrl + 'location/suggest/' + value + '/' + postal);

    request.success(function(jsonData) {
      locations.resolve(jsonData);
    });

    return locations.promise;

  };

}
