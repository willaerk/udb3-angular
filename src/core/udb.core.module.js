'use strict';

/**
 * @ngdoc module
 * @name udb.core
 * @description
 * The udb core module
 */
angular
  .module('udb.core', [
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select',
    'udb.config',
    'udb.search',
    'udb.entry',
    'udb.export',
    'udb.event-detail',
    'btford.socket-io',
    'pascalprecht.translate'
  ]);
