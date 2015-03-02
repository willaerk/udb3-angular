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
function UdbApi($q, $http, appConfig, $cookieStore, uitidAuth, $cacheFactory, UdbEvent, UdbOrganizer) {
  var apiUrl = appConfig.baseApiUrl;
  var defaultApiConfig = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      };
  var eventCache = $cacheFactory('eventCache');

  this.mainLanguage = 'nl';

  /**
   * @param {string} queryString - The query used to find events.
   * @param {?number} start - From which event offset the result set should start.
   * @param {object} conditions
   *   Extra conditions. E.g. location_zip or location_id.
   * @returns {Promise} A promise that signals a succesful retrieval of
   *  search results or a failure.
   */
  this.findEvents = function (queryString, start, conditions) {
    var deferredEvents = $q.defer(),
        offset = start || 0,
        searchParams = {
          start: offset
        };

    if(queryString.length) {
      searchParams.query = queryString;
    }
    if (conditions !== undefined) {
      for (var condition in conditions) {
        searchParams[condition] = conditions[condition];
      }
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
        appConfig.baseApiUrl + 'event/' + eventId,
        {
          headers: {
            'Accept': 'application/ld+json'
          }
        });

      eventRequest.success(function(jsonEvent) {
        var event = new UdbEvent();
        event.parseJson(jsonEvent);
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

  this.getOrganizerByLDId = function(organizerLDId) {
    var organizerId = organizerLDId.split('/').pop();
    return this.getOrganizerById(organizerId);
  };

  this.getOrganizerById = function(organizerId) {
    var deferredOrganizer = $q.defer();

    var organizer = eventCache.get(organizerId);

    if (organizer) {
      deferredOrganizer.resolve(organizer);
    } else {
      var organizerRequest  = $http.get(
        appConfig.baseApiUrl + 'organizer/' + organizerId,
        {
          headers: {
            'Accept': 'application/ld+json'
          }
        });

      organizerRequest.success(function(jsonOrganizer) {
        var organizer = new UdbOrganizer();
        organizer.parseJson(jsonOrganizer);
        eventCache.put(organizerId, organizer);
        deferredOrganizer.resolve(organizer);
      });
    }

    return deferredOrganizer.promise;
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
    return $http.post(appConfig.baseApiUrl + 'events/tag',
      {
        'keyword': label,
        'events' : eventIds
      },
      defaultApiConfig
    );
  };

  this.tagQuery = function (query, label) {
    return $http.post(appConfig.baseApiUrl + 'query/tag',
      {
        'keyword': label,
        'query' : query
      },
      defaultApiConfig
    );
  };

  this.exportEvents = function (query, email, format, properties, perDay, selection) {

    var exportData = {
      query: query,
      selection: selection || [],
      order: {},
      include: properties,
      perDay: perDay
    };

    if(email) {
      exportData.email = email;
    }

    return $http.post(appConfig.baseApiUrl + 'events/export/' + format, exportData, defaultApiConfig
    );
  };

  this.translateProperty = function (id, type, property, language, translation) {

    var translationData = {};
    translationData[property] = translation;

    return $http.post(
      appConfig.baseApiUrl + type + '/' + id + '/' + language + '/' + property,
      translationData,
      defaultApiConfig
    );
  };

  /**
   * Update the property for a given id.
   *
   * @param string id
   *   ID to update
   * @param string type
   *   Type of entity to update
   * @param string property
   *   Property to update
   * @param string value
   *   Value to save
   */
  this.updateProperty = function(eventId, type, property, value) {

    var updateData = {};
    updateData[property] = value;

    return $http.post(
      appConfig.baseUrl + type + '/' + eventId + '/' + property,
      updateData,
      defaultApiConfig
    );

  };

  this.tagEvent = function (eventId, label) {
    return $http.post(
      appConfig.baseApiUrl + 'event/' + eventId + '/keywords',
      { 'keyword': label},
      defaultApiConfig
    );
  };

  this.untagEvent = function (eventId, label) {
    return $http.delete(
      appConfig.baseApiUrl + 'event/' + eventId + '/keywords/' + label,
      defaultApiConfig
    );
  };

  this.createEvent = function (event) {
    return $http.post(
      appConfig.baseApiUrl + 'event',
      event,
      defaultApiConfig
    );
  };

  this.createPlace = function (event) {
    return $http.post(
      appConfig.baseApiUrl + 'place',
      event,
      defaultApiConfig
    );
  };
  

}
