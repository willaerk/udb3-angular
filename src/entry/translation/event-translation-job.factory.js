'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventTranslationJob
 * @description
 * # Event Tag Job
 * This Is the factory that creates an event tag job
 */
angular
  .module('udb.entry')
  .factory('EventTranslationJob', EventTranslationJobFactory);

/* @ngInject */
function EventTranslationJobFactory(BaseJob) {

  /**
   * @class EventTranslationJob
   * @constructor
   * @param {string} commandId
   * @param {UdbEvent} event
   * @param {string} property
   * @param {string} language
   * @param {string} translation
   */
  var EventTranslationJob = function (commandId, event, property, language, translation) {
    BaseJob.call(this, commandId);
    this.event = event;
    this.property = property;
    this.language = language;
    this.translation = translation;
  };

  EventTranslationJob.prototype = Object.create(BaseJob.prototype);
  EventTranslationJob.prototype.constructor = EventTranslationJob;

  EventTranslationJob.prototype.getDescription = function() {
    var job = this,
        description;

    switch (job.property) {
      case 'name':
        description = 'Vertaal naam van evenement "' + job.event.name.nl + '".';
        break;
      case 'description':
        description = 'Vertaal omschrijving van evenement "' + job.event.name.nl + '".';
        break;
      default:
        description = 'Vertaal "' + job.property + '" van evenement "' + job.event.name.nl + '".';
    }

    return description;
  };

  return (EventTranslationJob);
}
