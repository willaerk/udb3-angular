'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventCreationJob
 * @description
 * This Is the factory that creates an event creation job.
 */
angular
  .module('udb.entry')
  .factory('EventCreationJob', EventCreationJobFactory);

/* @ngInject */
function EventCreationJobFactory(BaseJob) {

  /**
   * @class EventCreationJob
   * @constructor
   * @param {string} commandId
   * @param {UdbEvent} event
   */
  var EventCreationJob = function (commandId, event, property, language, translation) {
    BaseJob.call(this, commandId);
    this.event = event;
  };

  EventCreationJob.prototype = Object.create(BaseJob.prototype);
  EventCreationJob.prototype.constructor = EventCreationJob;

  EventCreationJob.prototype.getDescription = function() {
    return 'Evenement toevoegen: "' + this.event.name.nl + '".';
  };

  return (EventCreationJob);
}
