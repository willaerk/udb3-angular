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
  .constant('JobStates',
  /**
   * Enum for job states
   * @readonly
   * @enum {string}
   */
  {
    CREATED: 'created',
    STARTED: 'started',
    FAILED: 'failed',
    FINISHED: 'finished'
  });
