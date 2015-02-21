'use strict';

/**
 * @ngdoc service
 * @name udb.core.eventTypes
 * @description
 * Service in the udb.core.
 */
angular
  .module('udb.core')
  .service('eventTypes', EventTypes);

/* @ngInject */
function EventTypes($q, $window, $location, $http, appConfig, $cookieStore) {

  /**
   * Get the categories.
   */
  this.getCategories = function () {

    var deferredEvent = $q.defer();

    var eventTypeRequest = $http.get(appConfig.udb3BaseUrl + '/src/event_form/categories.json');

    eventTypeRequest.success(function(jsonData) {
      deferredEvent.resolve(jsonData);
    });

    return deferredEvent.promise;

  };

}
