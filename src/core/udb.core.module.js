'use strict';

/**
 * @ngdoc module
 * @name udb.core
 * @description
 * The udb core module
 */
angular
  .module('udb.core', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'ui.select',
    'angularFileUpload',
    'udb.config',
    'udb.search',
    'udb.entry',
    'udb.event-form',
    'udb.export',
    'udb.event-detail',
    'udb.dashboard',
    'btford.socket-io',
    'pascalprecht.translate'
  ]);
