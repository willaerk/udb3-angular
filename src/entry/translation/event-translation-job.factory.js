'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventTranslationJob
 * @description
 * # Event Label Job
 * This Is the factory that creates an event label job
 */
angular
  .module('udb.entry')
  .factory('EventTranslationJob', EventTranslationJobFactory);

/* @ngInject */
function EventTranslationJobFactory(BaseJob, JobStates) {

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

    if(this.state === JobStates.FAILED) {
      description = 'Vertalen van evenement mislukt';
    } else {
      var propertyName;

      switch (job.property) {
        case 'name':
          propertyName = 'titel';
          break;
        case 'description':
          propertyName = 'omschrijving';
          break;
        default:
          propertyName = job.property;
      }

      description = 'Vertaal ' + propertyName + ' van "' + job.event.name.nl + '"';
    }

    return description;
  };

  return (EventTranslationJob);
}
