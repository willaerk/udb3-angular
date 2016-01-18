'use strict';

/**
 * @ngdoc service
 * @name udb.media.CreateImageJob
 * @description
 * # Image creation job
 * This factory creates a job that tracks image creation.
 */
angular
  .module('udb.media')
  .factory('CreateImageJob', CreateImageJobFactory);

/* @ngInject */
function CreateImageJobFactory(BaseJob, JobStates, $q) {

  /**
   * @class CreateImageJob
   * @constructor
   * @param {string} commandId
   */
  var CreateImageJob = function (commandId) {
    BaseJob.call(this, commandId);
    this.task = $q.defer();
  };

  CreateImageJob.prototype = Object.create(BaseJob.prototype);
  CreateImageJob.prototype.constructor = CreateImageJob;

  CreateImageJob.prototype.finish = function () {
    if (this.state !== JobStates.FAILED) {
      this.state = JobStates.FINISHED;
      this.finished = new Date();
    }
    this.progress = 100;
  };

  CreateImageJob.prototype.info = function (jobInfo) {
    this.task.resolve(jobInfo);
  };

  CreateImageJob.prototype.fail = function () {
    this.finished = new Date();
    this.state = JobStates.FAILED;
    this.progress = 100;
    this.task.reject('Failed to create an image object');
  };

  return (CreateImageJob);
}
