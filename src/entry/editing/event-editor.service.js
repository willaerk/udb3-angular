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
function EventEditor(jobLogger, udbApi, VariationCreationJob, BaseJob, $q, $cacheFactory) {

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
    var updatePromise = $q.defer();
    var variationPromise = this.getPersonalVariation(event);

    var rejectUpdate = function (reason) {
      updatePromise.reject(reason);
    };

    var createVariation = function () {
      purpose = purpose || 'personal';
      var creationRequest = udbApi.createVariation(event.id, description, purpose);

      creationRequest.success(function (jobData) {
        var variation = angular.copy(event);
        variation.description.nl = description;
        var variationCreationJob = new VariationCreationJob(jobData.commandId, event.id);
        jobLogger.addJob(variationCreationJob);

        variationCreationJob.task.promise.then(function (jobInfo) {
          variation.id = jobInfo['event_variation_id']; // jshint ignore:line
          personalVariationCache.put(event.id, variation);
          updatePromise.resolve();
        }, rejectUpdate);
      });

      creationRequest.error(rejectUpdate);
    };

    var editDescription = function (variation) {
      var editRequest = udbApi.editDescription(variation.id, description);

      editRequest.success(function (jobData) {
        variation.description.nl = description;
        jobLogger.addJob(new BaseJob(jobData.commandId));
        updatePromise.resolve();
      });

      editRequest.error(rejectUpdate);
    };

    variationPromise.then(editDescription, createVariation);

    return updatePromise;
  };

  this.deleteDescription = function (event, variation) {
    var deletePromise = udbApi.deleteEventDescription(variation.id);

    deletePromise.success(function (jobData) {
      jobLogger.addJob(new BaseJob(jobData.commandId));
      personalVariationCache.remove(event.id);
    });

    return deletePromise;
  };
}
