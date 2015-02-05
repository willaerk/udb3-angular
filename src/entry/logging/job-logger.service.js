'use strict';

/* jshint sub: true */

/**
 * @ngdoc service
 * @name udb.entry.jobLogger
 * @description
 * # jobLogger
 * Service in the udb.entry.
 */
angular
  .module('udb.entry')
  .service('jobLogger', JobLogger);

/* @ngInject */
function JobLogger(udbSocket, JobStates) {
  var jobs = {};
  var queue = [];

  /**
   * Finds a job  by id
   * @param jobId
   * @returns {BaseJob|undefined}
   */
  function findJob (jobId) {
    return _.find(queue, { id: jobId});
  }

  function jobStarted (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.start(data);
      console.log('job with id: ' + job.id + ' started');
    }
  }

  function jobFinished (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.finish(data);
      console.log('job with id: ' + job.id + ' finished');
    }
  }

  function jobFailed(data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.fail(data);
      console.log('job with id: ' + job.id + ' failed');
    }
  }

  function taskFinished (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.finishTask(data);
      console.log('Task of job with id: ' + job.id + ' finished.');
    }
  }

  function taskFailed (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.failTask(data);
      console.log('Task of job with id: ' + job.id + ' failed. Error message: ' + data.error);
    }
  }

  udbSocket.on('event_was_tagged', taskFinished);
  udbSocket.on('event_was_not_tagged', taskFailed);
  udbSocket.on('task_completed', taskFinished);
  udbSocket.on('job_started', jobStarted);
  udbSocket.on('job_finished', jobFinished);
  udbSocket.on('job_failed', jobFailed);

  this.getJobs = function () {
    return queue;
  };

  this.hasActiveJobs = function () {
    var activeJob = _.find(jobs, function (job) {
      return job.state !== JobStates.FINISHED && job.state !== JobStates.FAILED;
    });

    return !!activeJob;
  };

  this.addJob = function (job) {
    queue.unshift(job);
    console.log('job with id: ' + job.id + ' created');
  };
}
