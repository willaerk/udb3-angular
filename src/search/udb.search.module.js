'use strict';

/**
 * @ngdoc module
 * @name udb.search
 * @description
 * The udb search module
 */
angular
  .module('udb.search', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.bootstrap',
    'peg',
    'udb.config',
    'udb.search',
    'btford.socket-io',
    'pascalprecht.translate'
  ]);