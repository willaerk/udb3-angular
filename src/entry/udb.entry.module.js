'use strict';

/**
 * @ngdoc module
 * @name udb.entry
 * @description
 * The udb entry module
 */
angular
  .module('udb.entry', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'udb.config',
    'udb.search',
    'btford.socket-io',
    'pascalprecht.translate'
  ]);