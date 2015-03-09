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
   * @class EventCrudJob
   * @constructor
   * @param {string} commandId
   * @param {string} action
   * @param {UdbEvent|UdbPlace} item
   */
  var EventCrudJob = function (commandId, item, action) {
    BaseJob.call(this, commandId);
    this.item = item;
    this.action = action;
  };

  EventCrudJob.prototype = Object.create(BaseJob.prototype);
  EventCrudJob.prototype.constructor = EventCrudJob;

  EventCrudJob.prototype.getDescription = function() {

    switch (this.action) {

      case 'createEvent':
        return 'Evenement toevoegen: "' + this.item.name.nl + '".';

      case 'createPlace':
        return 'Locatie toevoegen: "' + this.item.name.nl + '".';

      case 'updateTypicalAgeRange':
        return 'Leeftijd aanpassen: "' + this.item.name.nl + '".';

      case 'updateOrganizer':
        return 'Organisator aanpassen: "' + this.item.name.nl + '".';

      case 'createOrganizer':
        return 'Organisatie toevoegen: "' + this.item.name + '".';

      case 'deleteOrganizer':
        return 'Organisatie verwijderen: "' + this.item.name + '".';

      case 'updateContactInfo':
        return 'Contact informatie aanpassen: "' + this.item.name + '".';

    }

  };

  return (EventCrudJob);
}
