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
function EventExportJobFactory(BaseJob) {

  /**
   * @class EventExportJob
   * @constructor
   * @param commandId
   */
  var EventExportJob = function (commandId) {
    BaseJob.call(this, commandId);
    this.exportUrl = '';
  };

  EventExportJob.prototype = Object.create(BaseJob.prototype);
  EventExportJob.prototype.constructor = EventExportJob;

  EventExportJob.prototype.getDescription = function() {
    return 'Exporting events';
  };

  return (EventExportJob);
}
