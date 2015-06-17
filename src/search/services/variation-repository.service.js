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
      deferredVariation.resolve(personalVariation);
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

      personalVariationRequest.success(function (variations) {
        var jsonPersonalVariation = _.first(variations.member);
        if (jsonPersonalVariation) {
          var variation = new UdbEvent(jsonPersonalVariation);
          personalVariationCache.put(event.id, variation);
          deferredVariation.resolve(variation);
        } else {
          deferredVariation.reject('there is no personal variation for event with id: ' + event.id);
        }
      });

      personalVariationRequest.error(function () {
        deferredVariation.reject('no variations found for event with id: ' + event.id);
      });

      return personalVariationRequest.then();
    };
  }

  this.save = function (eventId, variation) {
    personalVariationCache.put(eventId, variation);
  };

  this.remote = function (eventId) {
    personalVariationCache.remove(eventId);
  };
}
