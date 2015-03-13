'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventLabelBatchJob
 * @description
 * # BaseJob
 * This Is the factory that creates an event export job
 */
angular
  .module('udb.entry')
  .factory('EventLabelBatchJob', EventLabelBatchJobFactory);

/* @ngInject */
function EventLabelBatchJobFactory(BaseJob, JobStates) {

  /**
   * @class EventLabelBatchJob
   * @constructor
   * @param {string} commandId
   * @param {string[]} eventIds
   * @param {string} label
   */
  var EventLabelBatchJob = function (commandId, eventIds, label) {
    BaseJob.call(this, commandId);
    this.events = eventIds;
    this.addEventsAsTask(eventIds);
    this.label = label;
  };

  EventLabelBatchJob.prototype = Object.create(BaseJob.prototype);
  EventLabelBatchJob.prototype.constructor = EventLabelBatchJob;

  EventLabelBatchJob.prototype.addEventsAsTask = function (eventIds) {
    var job = this;
    _.forEach(eventIds, function (eventId) {
      job.addTask({id: eventId});
    });
  };

  EventLabelBatchJob.prototype.getDescription = function () {
    var job = this,
        description;

    if (this.state === JobStates.FAILED) {
      description = 'Labelen van evenementen mislukt';
    } else {
      description = 'Label ' + job.events.length + ' items met "' + job.label + '"';
    }

    return description;
  };

  return (EventLabelBatchJob);
}
