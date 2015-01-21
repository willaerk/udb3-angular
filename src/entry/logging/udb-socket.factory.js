'use strict';

/**
 * @ngdoc service
 * @name udb.entry.udbSocket
 * @description
 * # udbSocket
 * Factory in the udb.entry.
 */
angular
  .module('udb.entry')
  .factory('udbSocket', UdbSocketFactory);

/* @ngInject */
function UdbSocketFactory (socketFactory, appConfig) {
  var udbSocket = io.connect(appConfig.socketUrl);

  var socket = socketFactory({
    ioSocket: udbSocket
  });

  return socket;
}
