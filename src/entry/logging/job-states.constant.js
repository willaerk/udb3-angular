'use strict';

/* jshint sub: true */

/**
 * @ngdoc service
 * @name udb.entry.JobStates
 * @description
 * # JobStates
 * All the possible job states defined as a constant
 */
angular
  .module('udb.entry')
  .constant('JobStates', {
    CREATED: 'created',
    STARTED: 'started',
    FAILED: 'failed',
    FINISHED: 'finished'
  });