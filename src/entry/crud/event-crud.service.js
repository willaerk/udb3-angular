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
   * @param {UdbEvent}  event
   * The event to be created
   */
  this.createEvent = function (event) {

    var jobPromise = null;
    
    if (event.isEvent) {
      jobPromise = udbApi.createEvent(event);
    }
    else {
      jobPromise = udbApi.createPlace(event);
    }

    return jobPromise;
  };

  /**
   * Update the main language description and add it to the job logger.
   *
   * @param {UdbEvent|UdbPlace|EventFormData} item
   * @param {string} type
   *  Type of item: Event / Place
   * @returns {EventCrud.updateTypicalAgeRange.jobPromise}
   */
  this.updateDescription = function(item, type) {

    var jobPromise = udbApi.translateProperty(item.id, type, 'description', udbApi.mainLanguage, item.description.nl);

    jobPromise.success(function (jobData) {
      var job = new EventCrudJob(jobData.commandId, item, 'updateTypicalAgeRange');
      jobLogger.addJob(job);
    });

    return jobPromise;

  };

  /**
   * Update the typical age range and add it to the job logger.
   *
   * @param {UdbEvent|UdbPlace} item
   * @param {string} type
   *  Type of item
   * @returns {EventCrud.updateTypicalAgeRange.jobPromise}
   */
  this.updateTypicalAgeRange = function(item, type) {

    var jobPromise = udbApi.updateProperty(item.id, type, 'typicalAgeRange', item.typicalAgeRange);

    jobPromise.success(function (jobData) {
      var job = new EventCrudJob(jobData.commandId, item, 'updateTypicalAgeRange');
      jobLogger.addJob(job);
    });

    return jobPromise;

  };

}
