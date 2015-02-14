'use strict';

/**
 * @ngdoc service
 * @name udb.entry.eventCreator
 * @description
 * Service for creating new events.
 */
angular
  .module('udb.entry')
  .service('eventCreator', EventCreator);

/* @ngInject */
function EventCreator(jobLogger, udbApi, EventCreationJob) {

  /**
   * Creates a new event and add the job to the logger.
   *
   * @param {UdbEvent}  event        The event to be created
   */
  this.createEvent = function (event) {

    var jobPromise = udbApi.createEvent(event);

    jobPromise.success(function (jobData) {
      var job = new EventCreationJob(jobData.commandId, event);
      jobLogger.addJob(job);
    });

    return jobPromise;
  };
}
