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
function UdbApi($q, $http, $upload, appConfig, $cookieStore, uitidAuth,
  $cacheFactory, UdbEvent, UdbPlace, UdbOrganizer) {
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
   * @returns {Promise} A promise that signals a successful retrieval of
   *  search results or a failure.
   */
  this.findEvents = function (queryString, start) {
    var deferredEvents = $q.defer(),
        offset = start || 0,
        searchParams = {
          start: offset
        };

    if (queryString.length) {
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

  this.getEventById = function (eventId) {
    var deferredEvent = $q.defer();

    var event = eventCache.get(eventId);

    if (event) {
      deferredEvent.resolve(event);
    } else {
      var eventRequest = $http.get(
        appConfig.baseUrl + 'event/' + eventId,
        {
          headers: {
            'Accept': 'application/ld+json'
          }
        });

      eventRequest.success(function (jsonEvent) {
        var event = new UdbEvent();
        event.parseJson(jsonEvent);
        eventCache.put(eventId, event);
        deferredEvent.resolve(event);
      });

      eventRequest.error(function () {
        deferredEvent.reject();
      });
    }

    return deferredEvent.promise;
  };

  this.getEventByLDId = function (eventLDId) {
    var eventId = eventLDId.split('/').pop();
    return this.getEventById(eventId);
  };

  this.getPlaceById = function(placeId) {
    var deferredEvent = $q.defer();

    var place = eventCache.get(placeId);

    if (place) {
      deferredEvent.resolve(place);
    } else {
      var placeRequest  = $http.get(
        appConfig.baseApiUrl + 'place/' + placeId,
        {
          headers: {
            'Accept': 'application/ld+json'
          }
        });

      placeRequest.success(function(jsonPlace) {
        var place = new UdbPlace();
        place.parseJson(jsonPlace);
        eventCache.put(placeId, place);
        deferredEvent.resolve(place);
      });

      placeRequest.error(function () {
        deferredEvent.reject();
      });
    }

    return deferredEvent.promise;
  };

  this.getPlaceByLDId = function (placeLDId) {
    var placeId = placeLDId.split('/').pop();
    return this.getPlaceById(placeId);
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
  this.getEventHistoryById = function (eventId) {
    var eventHistoryLoaded = $q.defer();

    var eventHistoryRequest = $http.get(
      appConfig.baseUrl + 'event/' + eventId + '/history',
      {
        headers: {
          'Accept': 'application/json'
        }
      });

    eventHistoryRequest.success(function (eventHistory) {
      eventHistoryLoaded.resolve(eventHistory);
    });

    eventHistoryRequest.error(function () {
      eventHistoryLoaded.reject();
    });

    return eventHistoryLoaded.promise;
  };

  /**
   * @returns {Promise} A list of labels wrapped as a promise.
   */
  this.getRecentLabels = function () {
    var deferredLabels = $q.defer();

    var request = $http.get(apiUrl + 'user/labels', {
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

    if (activeUser) {
      deferredUser.resolve(activeUser);
    } else {

      var request = $http.get(appConfig.baseUrl + 'uitid/user', {
        withCredentials: true
      });

      request.success(function (userData) {
        $cookieStore.put('user', userData);
        deferredUser.resolve(userData);
      });

      request.error(function () {
        deferredUser.reject();
      });
    }

    return deferredUser.promise;
  };

  /**
   * @param {string} id
   *   Id of item to check
   */
  this.hasPermission = function(id) {
    return $http.get(appConfig.baseUrl + 'event/' + id + '/permission',
      {},
      defaultApiConfig
    );
  };

  this.labelEvents = function (eventIds, label) {
    return $http.post(appConfig.baseUrl + 'events/label',
      {
        'label': label,
        'events': eventIds
      },
      defaultApiConfig
    );
  };

  this.labelQuery = function (query, label) {
    return $http.post(appConfig.baseUrl + 'query/label',
      {
        'label': label,
        'query': query
      },
      defaultApiConfig
    );
  };

  this.exportEvents = function (query, email, format, properties, perDay, selection, customizations) {

    var exportData = {
      query: query,
      selection: selection || [],
      order: {},
      include: properties,
      perDay: perDay,
      customizations: customizations || {}
    };

    if (email) {
      exportData.email = email;
    }

    return $http.post(appConfig.baseUrl + 'events/export/' + format, exportData, defaultApiConfig);
  };

  this.translateProperty = function (id, type, property, language, translation) {

    var translationData = {};
    translationData[property] = translation;

    return $http.post(
      appConfig.baseUrl + type + '/' + id + '/' + language + '/' + property,
      translationData,
      defaultApiConfig
    );
  };

  /**
   * Update the property for a given id.
   *
   * @param {string} id
   *   ID to update
   * @param {string} type
   *   Type of entity to update
   * @param {string} property
   *   Property to update
   * @param {string} value
   *   Value to save
   */
  this.updateProperty = function(id, type, property, value) {

    var updateData = {};
    updateData[property] = value;

    return $http.post(
      appConfig.baseUrl + type + '/' + id + '/' + property,
      updateData,
      defaultApiConfig
    );

  };

  this.labelEvent = function (eventId, label) {
    return $http.post(
      appConfig.baseUrl + 'event/' + eventId + '/labels',
      {'label': label},
      defaultApiConfig
    );
  };

  this.unlabelEvent = function (eventId, label) {
    return $http['delete'](
      appConfig.baseUrl + 'event/' + eventId + '/labels/' + label,
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

  this.removeEvent = function (id, event) {
    return $http['delete'](
      appConfig.baseApiUrl + 'event/' + id + '/delete',
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

  this.removePlace = function (id, event) {
    return $http['delete'](
        appConfig.baseApiUrl + 'place/' + id + '/delete',
        defaultApiConfig
    );
  };

  this.createVariation = function (eventId, description, purpose) {
    var activeUser = uitidAuth.getUser(),
        requestData = {
          'owner': activeUser.id,
          'purpose': purpose,
          'same_as': appConfig.baseUrl + 'event/' + eventId,
          'description': description
        };

    return $http.post(
      appConfig.baseUrl + 'variations/',
      requestData,
      defaultApiConfig
    );
  };

  this.editDescription = function (variationId, description) {
    return $http.patch(
      appConfig.baseUrl + 'variations/' + variationId,
      {'description': description},
      defaultApiConfig
    );
  };

  /**
   * find events for a given location id
   * @param {type} id
   * @returns {array}
   */
  this.findEventsForLocation = function(id) {
    return $http.get(appConfig.baseUrl + 'place/' + id + '/events',
      {
        'id': id
      },
      defaultApiConfig
    );
  };

  /**
   * Create a new organizer.
   */
  this.createOrganizer = function(organizer) {
    return $http.post(
      appConfig.baseApiUrl + 'organizer',
      organizer,
      defaultApiConfig
    );
  };

  /**
   * Update the major info of an item.
   */
  this.updateMajorInfo = function(id, type, item) {
    return $http.post(
      appConfig.baseApiUrl + type + '/' + id + '/major-info',
      item,
      defaultApiConfig
    );
  };

  /**
   * Delete the typical age range for an offer.
   */
  this.deleteTypicalAgeRange = function(id, type) {

    return $http['delete'](
      appConfig.baseApiUrl + type + '/' + id + '/typicalAgeRange',
      defaultApiConfig
    );
  };

  /**
   * Delete the organizer for an offer.
   */
  this.deleteOfferOrganizer = function(id, type, organizerId) {

    return $http['delete'](
        appConfig.baseApiUrl + type + '/' + id + '/organizer/' + organizerId,
        defaultApiConfig
    );
  };

  this.deleteVariation = function (variationId) {
    return $http['delete'](
      appConfig.baseUrl + 'variations/' + variationId,
      defaultApiConfig
    );
  };

  /**
   * Add a new image.
   */
  this.addImage = function(id, type, image, description, copyrightHolder) {

    // Don't use defaultApiConfig, $upload adds custom stuff to it.
    var options = {};
    options.withCredentials = true;
    options.url = appConfig.baseApiUrl + type + '/' + id + '/image';
    options.fields = {
      description: description,
      copyrightHolder : copyrightHolder
    };
    options.file = image;

    return $upload.upload(options);

  };

  /**
   * Update an image.
   */
  this.updateImage = function(id, type, indexToUpdate, image, description, copyrightHolder) {

    // Image is also changed.
    if (image) {

      // Don't use defaultApiConfig, $upload adds custom stuff to it.
      var options = {};
      options.withCredentials = true;
      options.url = appConfig.baseApiUrl + type + '/' + id + '/image/' + indexToUpdate;
      options.fields = {
        description: description,
        copyrightHolder : copyrightHolder
      };
      options.file = image;

      return $upload.upload(options);

    }
    // Only the textfields change.
    else {

      var postData = {
        description: description,
        copyrightHolder : copyrightHolder
      };

      return $http.post(
        appConfig.baseApiUrl + type + '/' + id + '/image/' + indexToUpdate,
        postData,
        defaultApiConfig
      );
    }

  };

  /**
   * Delete an image.
   */
  this.deleteImage = function(id, type, indexToDelete) {

    return $http['delete'](
      appConfig.baseApiUrl + type + '/' + id + '/image/' + indexToDelete,
      defaultApiConfig
    );

  };

  this.getEventVariations = function (ownerId, purpose, eventUrl) {
    var parameters = {
      'owner': ownerId,
      'purpose': purpose,
      'same_as': eventUrl
    };

    var config = {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      params: _.pick(parameters, _.isString)
    };

    return $http.get(
      appConfig.baseUrl + 'variations/',
      config
    );
  };

  this.getVariation = function (variationId) {
    var deferredVariation = $q.defer();

    var variationRequest = $http.get(
      appConfig.baseUrl + 'variations/' + variationId,
      {
        headers: {
          'Accept': 'application/ld+json'
        }
      });

    variationRequest.success(function (jsonEvent) {
      var event = new UdbEvent(jsonEvent);
      deferredVariation.resolve(event);
    });

    variationRequest.error(function () {
      deferredVariation.reject();
    });

    return deferredVariation.promise;
  };
}
