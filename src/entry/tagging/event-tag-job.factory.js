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
function EventTagJobFactory(BaseJob) {

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

    if(job.untag) {
      description = 'Verwijder label "' + job.label + '" van "' + job.event.name.nl + '".';
    } else {
      description = 'Tag "' + job.event.name.nl + '" met label "' + job.label + '".';
    }

    return description;
  };

  EventTagJob.prototype.getTemplateName = function () {
    return 'base-job';
  };

  return (EventTagJob);
}
