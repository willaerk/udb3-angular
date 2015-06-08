'use strict';

/**
 * @ngdoc service
 * @name udb.entry.eventEditor
 * @description
 * # eventEditor
 * Service in the udb.entry.
 */
angular
  .module('udb.entry')
  .service('eventEditor', EventEditor);

/* @ngInject */
function EventEditor(jobLogger, udbApi, BaseJob, $q, $cacheFactory) {

  var personalVariationCache = $cacheFactory('personalVariationCache');

  this.getPersonalVariation = function (event) {
    var deferredVariation =  $q.defer();
    var personalVariation = personalVariationCache.get(event.id);

    if (personalVariation) {
      deferredVariation.resolve(personalVariation);
    } else {
      var userPromise = udbApi.getMe();

      userPromise
        .then(function(user) {
          var personalVariationPromise = udbApi.getEventVariations(user.id, 'personal', event.id);
          personalVariationPromise.then(function (variations) {
            var personalVariation = _.first(variations.member);
            if (personalVariation) {
              personalVariationCache.put(event.id, personalVariation);
              deferredVariation.resolve(personalVariation);
            } else {
              deferredVariation.reject('there is no personal variation for event with id: ' + event.id);
            }
          },
          function () {
            deferredVariation.reject('no variations found for event with id: ' + event.id);
          });
        });
    }

    return deferredVariation.promise;
  };

  /**
   * Edit the description of an event. We never edit the original event but use a variation instead.
   *
   * @param {UdbEvent} event                 The original event
   * @param {string}   description           The new description text
   * @param {string}   [purpose=personal]    The purpose of the variation that will be edited
   */
  this.editDescription = function (event, description, purpose) {
    purpose = purpose || 'personal';
    var updatePromise = udbApi.updateEventDescription(event.id, description, purpose);

    updatePromise.success(function (jobData) {
      event.nl.description = description;
      jobLogger.add(new BaseJob(jobData.commandId));
    });

    return updatePromise;
  };

  this.deleteDescription = function (event, variation) {
    var deletePromise = udbApi.deleteEventDescription(variation.id);

    deletePromise.success(function (jobData) {
      jobLogger.add(new BaseJob(jobData.commandId));
      personalVariationCache.remove(event.id);
    });

    return deletePromise;
  };
}
