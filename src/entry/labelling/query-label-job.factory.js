'use strict';

/**
 * @ngdoc service
 * @name udb.entry.QueryLabelJob
 * @description
 * # BaseJob
 * This Is the factory that creates an event export job
 */
angular
  .module('udb.entry')
  .factory('QueryLabelJob', QueryLabelJobFactory);

/* @ngInject */
function QueryLabelJobFactory(BaseJob) {

  /**
   * @class QueryLabelJob
   * @constructor
   * @param {string} commandId
   * @param {number} eventCount
   * @param {string} label
   */
  var QueryLabelJob = function (commandId, eventCount, label) {
    BaseJob.call(this, commandId);
    this.eventCount = eventCount;
    this.label = label;
  };

  QueryLabelJob.prototype = Object.create(BaseJob.prototype);
  QueryLabelJob.prototype.constructor = QueryLabelJob;

  QueryLabelJob.prototype.getTaskCount = function () {
    return this.eventCount;
  };

  QueryLabelJob.prototype.getDescription = function() {
    var job = this;
    return 'Label ' + job.eventCount + ' evenementen met label "' + job.label + '".';
  };

  return (QueryLabelJob);
}
