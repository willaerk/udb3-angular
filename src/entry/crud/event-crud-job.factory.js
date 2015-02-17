'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventCreationJob
 * @description
 * This Is the factory that creates an event creation job.
 */
angular
  .module('udb.entry')
  .factory('EventCrudJob', EventCrudJobFactory);

/* @ngInject */
function EventCrudJobFactory(BaseJob) {

  /**
   * @class EventCreationJob
   * @constructor
   * @param {string} commandId
   * @param {UdbEvent} event
   */
  var EventCrudJob = function (commandId, event, action) {
    BaseJob.call(this, commandId);
    this.event = event;
  };

  EventCrudJob.prototype = Object.create(BaseJob.prototype);
  EventCrudJob.prototype.constructor = EventCrudJob;

  EventCrudJob.prototype.getDescription = function() {

    switch (this.action) {

      case 'create':
        return 'Evenement toevoegen: "' + this.event.name.nl + '".';

    }

  };

  return (EventCrudJob);
}
