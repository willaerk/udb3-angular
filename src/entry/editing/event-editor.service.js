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
function EventEditor(jobLogger, udbApi, BaseJob) {

  /**
   * Edit the description of an event. We never edit the original event but use a variation instead.
   *
   * @param {UdbEvent} event                 The original event
   * @param {string}   description           The new description text
   * @param {string}   [purpose=optional]    The purpose of the variation that will be edited
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
    var deletePromise = udbApi.deleteEventDescription(event.id, variation.id);

    deletePromise.success(function (jobData) {
      jobLogger.add(new BaseJob(jobData.commandId));
    });

    return deletePromise;
  };
}
