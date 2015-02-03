'use strict';

/**
 * @ngdoc service
 * @name udb.entry.evenTagger
 * @description
 * # eventTagger
 * Service in the udb.entry.
 */
angular
  .module('udb.entry')
  .service('eventTagger', EventTagger);

/* @ngInject */
function EventTagger(jobLogger, udbApi, EventTagJob, EventTagBatchJob, QueryTagJob) {

  var eventTagger = this;

  // keep a cache of all the recently used labels
  eventTagger.recentLabels = ['some', 'recent', 'label'];

  function updateRecentLabels() {
    var labelPromise = udbApi.getRecentLabels();

    labelPromise.then(function (labels) {
      eventTagger.recentLabels = labels;
    });
  }

  // warm up the cache
  updateRecentLabels();

  /**
   * Tag an event with a label
   * @param {UdbEvent} event
   * @param {string} label
   */
  this.tag = function (event, label) {
    var jobPromise = udbApi.tagEvent(event.id, label);

    jobPromise.success(function (jobData) {
      event.tag(label);
      var job = new EventTagJob(jobData.commandId, event, label);
      jobLogger.addJob(job);
    });
  };

  /**
   * Untag a label from an event
   * @param {UdbEvent} event
   * @param {string} label
   */
  this.untag = function (event, label) {
    var jobPromise = udbApi.untagEvent(event.id, label);

    jobPromise.success(function (jobData) {
      event.untag(label);
      var job = new EventTagJob(jobData.commandId, event, label, true);
      jobLogger.addJob(job);
    });
  };

  /**
   * @param {string[]} eventIds
   * @param {string} label
   */
  this.tagEventsById = function (eventIds, label) {
    var jobPromise = udbApi.tagEvents(eventIds, label);

    jobPromise.success(function (jobData) {
      var job = new EventTagBatchJob(jobData.commandId, eventIds, label);
      console.log(job);
      jobLogger.addJob(job);
    });
  };

  /**
   *
   * @param {string} query
   * @param {string} label
   */
  this.tagQuery = function (query, label, eventCount) {
    var jobPromise = udbApi.tagQuery(query, label);
    eventCount = eventCount || 0;

    jobPromise.success(function (jobData) {
      var job = new QueryTagJob(jobData.commandId, eventCount, label);
      jobLogger.addJob(job);
    });

  };
}
