'use strict';

/* jshint sub: true */

/**
 * @ngdoc service
 * @name udb.entry.JobLogoStates
 * @description
 * # JobLogoStates
 * All the possible job logo states defined as a constant
 */
angular
  .module('udb.entry')
  .constant('JobLogoStates',
  /**
   * Enum for job logo states
   * @readonly
   * @enum {string}
   */
  {
    WARNING: 'warning',
    COMPLETE: 'complete',
    BUSY: 'busy',
    IDLE: 'idle'
  });
