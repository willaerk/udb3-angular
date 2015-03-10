'use strict';

/**
 * @ngdoc service
 * @name udb.event-form.eventFormFacilities
 * @description
 * Service for loading the event form facilities.
 */
angular
  .module('udb.core')
  .service('eventFormFacilities', EventFormFacilities);

/* @ngInject */
function EventFormFacilities($q, $http, $cacheFactory, appConfig) {

  var cache = $cacheFactory('facilitiesCache');

  /**
   * Get the facilities.
   */
  this.getFacilities = function () {

    var deferredEvent = $q.defer();
    var facilities = cache.get('facilities');

    if (facilities) {
      deferredEvent.resolve(facilities);
    } else {
      var request = $http.get(appConfig.udb3JsBaseUrl + '/src/event_form/facilities.json');

      request.success(function(jsonData) {
        deferredEvent.resolve(jsonData);
        cache.put('facilities', jsonData);
      });
    }

    return deferredEvent.promise;

  };

}
