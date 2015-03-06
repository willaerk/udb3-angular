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
    return $http.get(appConfig.baseApiUrl + 'city/suggest/' + value);
  };

  /**
   *
   * Get the locations for a city
   *
   * @param {type} value
   * @returns {$q@call;defer.promise}
   */
  this.getLocationsForCity = function(value, postal) {
    return $http.get(appConfig.baseApiUrl + 'location/suggest/' + value + '/' + postal);
  };

}
