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
function EventTypes($q, $window, $location, $http, $cacheFactory, appConfig, $cookieStore) {

  var cache = $cacheFactory('categoriesCache');

  /**
   * Get the categories.
   */
  this.getCategories = function () {

    var deferredEvent = $q.defer();
    var categories = cache.get('categories');

    if (categories) {
      deferredEvent.resolve(categories);
    } else {
      var eventTypeRequest = $http.get(appConfig.udb3JsBaseUrl + '/src/event_form/categories.json');

      eventTypeRequest.success(function(jsonData) {
        deferredEvent.resolve(jsonData);
        cache.put('categories', jsonData);
      });
    }

    return deferredEvent.promise;

  };

}
