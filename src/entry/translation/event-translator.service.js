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
function EventTranslator(jobLogger, udbApi) {

  /**
   * Translates an event property to a given language and adds the job to the logger
   *
   * @param {UdbEvent}  event        The event that needs translating
   * @param {string}    property     The name of the property to translate
   * @param {string}    language     The abbreviation of the translation language
   * @param {string}    translation  Translation to save
   */
  this.translateProperty = function (event, property, language, translation) {
    var jobPromise = udbApi.translateEventProperty(event.id, property, language, translation);

    jobPromise.success(function (jobData) {
      var jobId = jobData.commandId;
      // TODO get rid of this hack;
      if (property === 'title') {
        property = 'name';
      }
      event[property][language] = translation;
      var jobTitle;
      switch (property) {
        case 'name':
          jobTitle = 'Vertaal naam van evenement "' + event.name.nl + '".';
          break;
        case 'description':
          jobTitle = 'Vertaal omschrijving van evenement "' + event.name.nl + '".';
          break;
        default:
          jobTitle = 'Vertaal ' + property + ' van evenement "' + event.name.nl + '".';
      }
      jobLogger.createTranslationJob(
        jobId,
        jobTitle,
        event);
    });

    return jobPromise;
  };
}
