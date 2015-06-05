'use strict';

/* jshint sub: true */

/**
 * @ngdoc constant
 * @name udb.search.EventTranslationState
 * @description
 * # EventTranslationState
 * Event translation state
 */
angular
  .module('udb.search')
  .constant(
  'EventTranslationState',
  /**
   * Enum for event translation states
   * @readonly
   * @enum {string}
   */
  {
    ALL: {'name': 'all', 'icon': 'fa-circle'},
    NONE: {'name': 'none', 'icon': 'fa-circle-o'},
    SOME: {'name': 'some', 'icon': 'fa-dot-circle-o'}
  }
);
