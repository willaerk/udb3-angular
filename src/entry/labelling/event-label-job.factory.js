'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventLabelJob
 * @description
 * # Event Label Job
 * This Is the factory that creates an event label job
 */
angular
  .module('udb.entry')
  .factory('EventLabelJob', EventLabelJobFactory);

/* @ngInject */
function EventLabelJobFactory(BaseJob, JobStates) {

  /**
   * @class EventLabelJob
   * @constructor
   * @param {string} commandId
   * @param {UdbEvent} event
   * @param {string} label
   * @param {boolean} unlabel set to true when unlabeling
   */
  var EventLabelJob = function (commandId, event, label, unlabel) {
    BaseJob.call(this, commandId);
    this.event = event;
    this.label = label;
    this.unlabel = !!unlabel || false;
  };

  EventLabelJob.prototype = Object.create(BaseJob.prototype);
  EventLabelJob.prototype.constructor = EventLabelJob;

  EventLabelJob.prototype.getDescription = function() {
    var job = this,
        description;

    if(job.state === JobStates.FAILED) {
      description = 'Labelen van evenement mislukt';
    } else {
      if(job.unlabel) {
        description = 'Verwijder label "' + job.label + '" van "' + job.event.name.nl + '"';
      } else {
        description = 'Label "' + job.event.name.nl + '" met "' + job.label + '"';
      }
    }

    return description;
  };

  return (EventLabelJob);
}
