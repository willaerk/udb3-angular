'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventTagBatchJob
 * @description
 * # BaseJob
 * This Is the factory that creates an event export job
 */
angular
  .module('udb.entry')
  .factory('EventTagBatchJob', EventTagBatchJobFactory);

/* @ngInject */
function EventTagBatchJobFactory(BaseJob, JobStates) {

  /**
   * @class EventTagBatchJob
   * @constructor
   * @param {string} commandId
   * @param {string[]} eventIds
   * @param {string} label
   */
  var EventTagBatchJob = function (commandId, eventIds, label) {
    BaseJob.call(this, commandId);
    this.events = eventIds;
    this.addEventsAsTask(eventIds);
    this.label = label;
  };

  EventTagBatchJob.prototype = Object.create(BaseJob.prototype);
  EventTagBatchJob.prototype.constructor = EventTagBatchJob;

  EventTagBatchJob.prototype.addEventsAsTask = function (eventIds) {
    var job = this;
    _.forEach(eventIds, function (eventId) {
      job.addTask({ id: eventId});
    });
  };

  EventTagBatchJob.prototype.getDescription = function() {
    var job = this,
        description;

    if(this.state === JobStates.FAILED) {
      description = 'Labelen van evenementen mislukt';
    } else {
      description = 'Label ' + job.events.length + ' items met "' + job.label + '"';
    }

    return description;
  };

  return (EventTagBatchJob);
}
