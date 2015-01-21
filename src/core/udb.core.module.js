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
    'udb.config',
    'udb.search',
    'udb.entry',
    'btford.socket-io',
    'pascalprecht.translate'
  ]);