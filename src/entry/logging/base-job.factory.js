'use strict';

/**
 * @ngdoc service
 * @name udb.entry.BaseJob
 * @description
 * # BaseJob
 * This Is the factory that creates base jobs
 */
angular
  .module('udb.entry')
  .factory('BaseJob', BaseJobFactory);

/* @ngInject */
function BaseJobFactory(JobStates) {

  /**
   * @class BaseJob
   * @constructor
   * @param commandId
   *
   * @property {object[]}   tasks        - A list of tasks
   * @property {string}     id           - The command ID that uniquely identifies this job
   */
  var BaseJob = function (commandId) {
    this.id = commandId;
    this.state = JobStates.CREATED;
    this.progress = 0;
    this.created = new Date();
    this.tasks = [];
    this.completedTaskCount = 0;
    this.progress = 0;
  };

  BaseJob.prototype.constructor = BaseJob;

  BaseJob.prototype.fail = function () {
    this.state = JobStates.FAILED;
    this.progress = 100;
  };

  BaseJob.prototype.start = function () {
    this.state = JobStates.STARTED;
  };

  BaseJob.prototype.finish = function () {
    if(this.state !== JobStates.FAILED) {
      this.state = JobStates.FINISHED;
    }
    this.progress = 100;
  };

  BaseJob.prototype.getDescription = function () {
    return 'Job with id: ' + this.id;
  };

  BaseJob.prototype.getTemplateName = function () {
    return 'base-job';
  };

  BaseJob.prototype.addTask = function (task) {
    this.tasks.push(task);
  };

  BaseJob.prototype.getTaskCount = function () {
    return this.tasks.length;
  };

  BaseJob.prototype.findTask = function (taskData) {
    var taskId = taskData['event_id'],
        task =  _.find(this.tasks, { id: taskId});

    if(!task) {
      task = { id: taskId};
      this.addTask(task);
    }

    return task;
  };

  BaseJob.prototype.failTask = function (taskData) {
    var task = this.findTask(taskData);

    if(task) {
      task.state = 'failed';
      this.updateProgress();
    }
  };

  BaseJob.prototype.finishTask = function (taskData) {
    var task = this.findTask(taskData);

    if(task) {
      task.state = 'finished';
      this.updateProgress();
    }
  };

  BaseJob.prototype.updateProgress = function () {
    var job = this;

    ++job.completedTaskCount;
    job.progress = (job.completedTaskCount / job.getTaskCount()) * 100;
  };

  return (BaseJob);
}
