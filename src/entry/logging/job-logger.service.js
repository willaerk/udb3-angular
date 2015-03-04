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
function JobLogger(udbSocket, JobStates, EventExportJob) {
  var jobs = [],
      queuedJobs = [],
      failedJobs = [],
      finishedExportJobs = [];

  /**
   * Finds a job  by id
   * @param jobId
   * @returns {BaseJob|undefined}
   */
  function findJob (jobId) {
    return _.find(jobs, { id: jobId});
  }

  function jobStarted (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.start(data);
      console.log('job with id: ' + job.id + ' started');
      updateJobLists();
    }
  }

  function jobInfo (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.info(data);
      console.log('job with id: ' + job.id + ' received some info.');
    }
  }

  function jobFinished (data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.finish(data);
      console.log('job with id: ' + job.id + ' finished');
      updateJobLists();
    }
  }

  function jobFailed(data) {
    var job = findJob(data['job_id']);

    if(job) {
      job.fail(data);
      console.log('job with id: ' + job.id + ' failed');
      updateJobLists();
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

  function updateJobLists() {
    failedJobs = _.filter(jobs, function(job) {
      return job.state === JobStates.FAILED;
    });

    finishedExportJobs = _.filter(jobs, function(job) {
      return job instanceof EventExportJob && job.state === JobStates.FINISHED;
    });

    queuedJobs = _.filter(jobs, function(job) {
      return job.state !== JobStates.FINISHED && job.state !== JobStates.FAILED;
    });
  }

  udbSocket.on('event_was_tagged', taskFinished);
  udbSocket.on('event_was_not_tagged', taskFailed);
  udbSocket.on('task_completed', taskFinished);
  udbSocket.on('job_started', jobStarted);
  udbSocket.on('job_info', jobInfo);
  udbSocket.on('job_finished', jobFinished);
  udbSocket.on('job_failed', jobFailed);

  this.hasActiveJobs = function () {
    return !!queuedJobs.length;
  };

  this.addJob = function (job) {
    jobs.unshift(job);
    console.log('job with id: ' + job.id + ' created');
    updateJobLists();
  };

  this.getQueuedJobs = function () {
    return queuedJobs;
  };

  this.getFailedJobs = function () {
    return failedJobs;
  };

  this.getFinishedExportJobs = function () {
    return finishedExportJobs;
  };
}
