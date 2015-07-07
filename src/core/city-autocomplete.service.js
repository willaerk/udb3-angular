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
function CityAutocomplete($q, $http, appConfig, UdbPlace) {

  /**
   *
   * Get the places for a city
   *
   * @param {type} zipcode
   * @returns {$q@call;defer.promise}
   */
  this.getPlacesForCity = function(zipcode) {

    var deferredPlaces = $q.defer();

    var config = {
      params: {
        q: 'zipcode:' +  zipcode
      }
    };

    var parsePagedCollection = function (response) {
      var locations = _.map(response.data.member, function (placeJson) {
        return new UdbPlace(placeJson);
      });

      deferredPlaces.resolve(response.data.member);
    };

    var failed = function () {
      deferredPlaces.reject('something went wrong while getting places for city with zipcode: ' + zipcode);
    };

    $http.get(appConfig.baseUrl + 'places', config).then(parsePagedCollection, failed);

    return deferredPlaces.promise;
  };

}
