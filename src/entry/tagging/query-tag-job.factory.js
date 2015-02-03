'use strict';

/**
 * @ngdoc service
 * @name udb.entry.QueryTagJob
 * @description
 * # BaseJob
 * This Is the factory that creates an event export job
 */
angular
  .module('udb.entry')
  .factory('QueryTagJob', QueryTagJobFactory);

/* @ngInject */
function QueryTagJobFactory(BaseJob) {

  /**
   * @class QueryTagJob
   * @constructor
   * @param {string} commandId
   * @param {number} eventCount
   * @param {string} label
   */
  var QueryTagJob = function (commandId, eventCount, label) {
    BaseJob.call(this, commandId);
    this.eventCount = eventCount;
    this.label = label;
  };

  QueryTagJob.prototype = Object.create(BaseJob.prototype);
  QueryTagJob.prototype.constructor = QueryTagJob;

  QueryTagJob.prototype.getTemplateName = function () {
    return 'batch-job';
  };

  QueryTagJob.prototype.getTaskCount = function () {
    return this.eventCount;
  };

  QueryTagJob.prototype.getDescription = function() {
    var job = this;
    return 'Tag ' + job.eventCount + ' evenementen met label "' + job.label + '".';
  };

  return (QueryTagJob);
}
