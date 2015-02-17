'use strict';

/**
 * @ngdoc service
 * @name udb.entry.eventCrud
 * @description
 * Service for creating / updating events.
 */
angular
  .module('udb.entry')
  .service('eventCrud', EventCrud);

/* @ngInject */
function EventCrud(jobLogger, udbApi, EventCrudJob) {

  /**
   * Creates a new event and add the job to the logger.
   *
   * @param {UdbEvent}  event        The event to be created
   */
  this.createEvent = function (event) {

    var jobPromise = udbApi.createEvent(event);

    jobPromise.success(function (jobData) {
      var job = new EventCrudJob(jobData.commandId, event);
      jobLogger.addJob(job);
    });

    return jobPromise;
  };
}
