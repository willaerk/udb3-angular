'use strict';

/**
 * @ngdoc service
 * @name udb.entry.EventExportJob
 * @description
 * # BaseJob
 * This Is the factory that creates an event export job
 */
angular
  .module('udb.entry')
  .factory('EventExportJob', EventExportJobFactory);

/* @ngInject */
function EventExportJobFactory(BaseJob, JobStates) {

  /**
   * @class EventExportJob
   * @constructor
   * @param commandId
   */
  var EventExportJob = function (commandId, eventCount) {
    BaseJob.call(this, commandId);
    this.exportUrl = '';
    this.eventCount = eventCount;
  };

  EventExportJob.prototype = Object.create(BaseJob.prototype);
  EventExportJob.prototype.constructor = EventExportJob;

  EventExportJob.prototype.getTemplateName = function () {
    return 'export-job';
  };

  EventExportJob.prototype.getDescription = function() {
    return 'exporting events';
  };

  EventExportJob.prototype.info = function (jobData) {
    if(jobData.location) {
      this.exportUrl = jobData.location;
    }
  };

  EventExportJob.prototype.getTaskCount = function () {
    return this.eventCount;
  };

  return (EventExportJob);
}
