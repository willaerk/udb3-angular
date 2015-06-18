'use strict';

/**
 * @ngdoc service
 * @name udb.search.variationRepository
 * @description
 * # variationRepository
 * Service in the udb.search.
 */
angular
  .module('udb.search')
  .service('variationRepository', VariationRepository);

/* @ngInject */
function VariationRepository(udbApi, $cacheFactory, $q, UdbEvent) {

  var requestChain = $q.when();
  var personalVariationCache = $cacheFactory('personalVariationCache');

  this.getPersonalVariation = function (event) {
    var deferredVariation =  $q.defer(),
        personalVariation = personalVariationCache.get(event.id);

    if (personalVariation) {
      if (personalVariation === 'no-personal-variation') {
        deferredVariation.reject('there is no personal variation for event with id: ' + event.id);
      } else {
        deferredVariation.resolve(personalVariation);
      }
    } else {
      var userPromise = udbApi.getMe();

      userPromise
        .then(function(user) {
          requestChain = requestChain.then(
            requestVariation(user.id, 'personal', event.apiUrl, deferredVariation)
          );
        });
    }

    return deferredVariation.promise;
  };

  function requestVariation(userId, purpose, eventUrl, deferredVariation) {
    return function () {
      var personalVariationRequest = udbApi.getEventVariations(userId, purpose, eventUrl, deferredVariation);
      var eventId = eventUrl.split('/').pop();

      personalVariationRequest.success(function (variations) {
        var jsonPersonalVariation = _.first(variations.member);
        if (jsonPersonalVariation) {
          var variation = new UdbEvent(jsonPersonalVariation);
          personalVariationCache.put(eventId, variation);
          deferredVariation.resolve(variation);
        } else {
          personalVariationCache.put(eventId, 'no-personal-variation');
          deferredVariation.reject('there is no personal variation for event with id: ' + eventId);
        }
      });

      personalVariationRequest.error(function () {
        deferredVariation.reject('no variations found for event with id: ' + eventId);
      });

      return personalVariationRequest.then();
    };
  }

  this.save = function (eventId, variation) {
    personalVariationCache.put(eventId, variation);
  };

  this.remove = function (eventId) {
    personalVariationCache.remove(eventId);
  };
}
