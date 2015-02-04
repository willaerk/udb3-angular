'use strict';

/**
 * @ngdoc service
 * @name udb.entry.eventExporter
 * @description
 * # eventExporter
 * Event Exporter Service
 */
angular
  .module('udb.export')
  .service('eventExporter', eventExporter);

/* @ngInject */
function eventExporter(jobLogger, udbApi, EventExportJob) {

  var ex = this; // jshint ignore:line

  ex.activeExport = {
    query: {},
    eventCount: 0
  };

  ex.export = function (format, email) {
    var queryString = ex.activeExport.query.queryString;

    var jobPromise = udbApi.exportQuery(queryString, email, format);

    jobPromise.success(function (jobData) {
      var job = new EventExportJob(jobData.commandId);
      jobLogger.addJob(job);
      job.start();
      console.log([job, job.getDescription()]);
    });

    return jobPromise;
  };
}
