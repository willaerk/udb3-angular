'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventTagJob
 * @description
 * # Event Tag Job
 * This Is the factory that creates an event tag job
 */
angular
  .module('udb.entry')
  .factory('EventTagJob', EventTagJobFactory);

/* @ngInject */
function EventTagJobFactory(BaseJob, JobStates) {

  /**
   * @class EventTagJob
   * @constructor
   * @param {string} commandId
   * @param {UdbEvent} event
   * @param {string} label
   * @param {boolean} untag set to true when untagging
   */
  var EventTagJob = function (commandId, event, label, untag) {
    BaseJob.call(this, commandId);
    this.event = event;
    this.label = label;
    this.untag = !!untag || false;
  };

  EventTagJob.prototype = Object.create(BaseJob.prototype);
  EventTagJob.prototype.constructor = EventTagJob;

  EventTagJob.prototype.getDescription = function() {
    var job = this,
        description;

    if(job.state === JobStates.FAILED) {
      description = 'Labelen van evenement mislukt';
    } else {
      if(job.untag) {
        description = 'Verwijder label "' + job.label + '" van "' + job.event.name.nl + '"';
      } else {
        description = 'Label "' + job.event.name.nl + '" met "' + job.label + '"';
      }
    }

    return description;
  };

  return (EventTagJob);
}
