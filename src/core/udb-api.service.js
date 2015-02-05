'use strict';

/**
 * @ngdoc service
 * @name udb.core.udbApi
 * @description
 * # udbApi
 * udb api service
 */
angular
  .module('udb.core')
  .service('udbApi', UdbApi);

/* @ngInject */
function UdbApi($q, $http, appConfig, $cookieStore, uitidAuth, $cacheFactory, UdbEvent) {
  var apiUrl = appConfig.baseApiUrl;
  var defaultApiConfig = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
  var eventCache = $cacheFactory('eventCache');

  /**
   * @param {string} queryString - The query used to find events.
   * @param {?number} start - From which event offset the result set should start.
   * @returns {Promise} A promise that signals a succesful retrieval of
   *  search results or a failure.
   */
  this.findEvents = function (queryString, start) {
    var deferredEvents = $q.defer(),
        offset = start || 0,
        searchParams = {
          start: offset
        };

    if(queryString.length) {
      searchParams.query = queryString;
    }

    var request = $http.get(apiUrl + 'search', {
      params: searchParams,
      withCredentials: true,
      headers: {
        'Accept': 'application/ld+json'
      }
    });

    request
    .success(function (data) {
      deferredEvents.resolve(data);
    })
    .error(function () {
      deferredEvents.reject();
    });

    return deferredEvents.promise;
  };

this.getEventById = function(eventId) {
  var deferredEvent = $q.defer();

  var event = eventCache.get(eventId);

  if(event) {
    deferredEvent.resolve(event);
  } else {
    var eventRequest  = $http.get(
      appConfig.baseUrl + 'event/' + eventId,
      {
        headers: {
          'Accept': 'application/ld+json'
        }
      });

    eventRequest.success(function(jsonEvent) {
      var event = new UdbEvent(jsonEvent);
      eventCache.put(eventId, event);
      deferredEvent.resolve(event);
    });
  }

  return deferredEvent.promise;
};

this.getEventByLDId = function (eventLDId) {
  var eventId = eventLDId.split('/').pop();
  return this.getEventById(eventId);
};

/**
 * @returns {Promise} A list of tags wrapped as a promise.
 */
this.getRecentLabels = function () {
  var deferredLabels = $q.defer();

  var request = $http.get(apiUrl + 'user/keywords', {
    withCredentials: true,
    headers: {
      'Accept': 'application/json'
    }
  });

  request
    .success(function (data) {
      deferredLabels.resolve(data);
    })
    .error(function () {
      deferredLabels.reject();
    });

  return deferredLabels.promise;
};

/**
 * @returns {Promise} A promise with the credentials of the currently logged in user.
 */
  this.getMe = function () {
    var deferredUser = $q.defer();

    var activeUser = uitidAuth.getUser();

    if(activeUser) {
      deferredUser.resolve(activeUser);
    } else {

      var request = $http.get(apiUrl + 'user', {
        withCredentials: true
      });

      request.success(function(userData) {
        $cookieStore.put('user', userData);
        deferredUser.resolve(userData);
      });

      request.error(function () {
        deferredUser.reject();
      });
    }

    return deferredUser.promise;
  };

this.tagEvents = function (eventIds, label) {
  return $http.post(appConfig.baseUrl + 'events/tag',
    {
      'keyword': label,
      'events' : eventIds
    },
    defaultApiConfig
  );
};

this.tagQuery = function (query, label) {
  return $http.post(appConfig.baseUrl + 'query/tag',
    {
      'keyword': label,
      'query' : query
    },
    defaultApiConfig
  );
};

this.exportQuery = function (query, email, format, fields, perDay) {
  return $http.post(appConfig.baseUrl + 'events/export/' + format,
    {
      query: query,
      selection: [],
      order: {},
      include: fields,
      email: email,
      perDay: perDay
    },
    defaultApiConfig
  );
};

this.translateEventProperty = function (eventId, property, language, translation) {

  var translationData = {};
  translationData[property] = translation;

  return $http.post(
    appConfig.baseUrl + 'event/' + eventId + '/' + language + '/' + property,
    translationData,
    defaultApiConfig
  );
};

this.tagEvent = function (eventId, label) {
  return $http.post(
    appConfig.baseUrl + 'event/' + eventId + '/keywords',
    { 'keyword': label},
    defaultApiConfig
  );
};

this.untagEvent = function (eventId, label) {
  return $http.delete(
    appConfig.baseUrl + 'event/' + eventId + '/keywords/' + label,
    defaultApiConfig
  );
};
}
