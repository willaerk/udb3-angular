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
      description = 'Vertaal ' + job.property + ' van "' + job.event.name.nl + '"';
    }

    return description;
  };

  return (EventTranslationJob);
}
