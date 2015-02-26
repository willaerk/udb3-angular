'use strict';

/**
 * @ngdoc service
 * @name udb.entry.eventTranslator
 * @description
 * # eventTranslator
 * Service in the udb.entry.
 */
angular
  .module('udb.entry')
  .service('eventTranslator', EventTranslator);

/* @ngInject */
function EventTranslator(jobLogger, udbApi, EventTranslationJob) {

  /**
   * Translates an event property to a given language and adds the job to the logger
   *
   * @param {UdbEvent}  event        The event that needs translating
   * @param {string}    property     The name of the property to translate
   * @param {string}    language     The abbreviation of the translation language
   * @param {string}    translation  Translation to save
   */
  this.translateProperty = function (event, property, language, translation) {
    var jobPromise = udbApi.translateProperty(event.id, 'event', property, language, translation);

    jobPromise.success(function (jobData) {
      // TODO get rid of this hack;
      if (property === 'title') {
        property = 'name';
      }
      event[property][language] = translation;
      var job = new EventTranslationJob(jobData.commandId, event, property, language, translation);
      jobLogger.addJob(job);
    });

    return jobPromise;
  };
}
