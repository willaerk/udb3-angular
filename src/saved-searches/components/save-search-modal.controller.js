'use strict';

/**
 * @ngdoc function
 * @name udb.entry.controller:SaveSearchModalController
 * @description
 * # SaveSearchModalController
 * Controller of the udb.entry
 */
angular
  .module('udb.saved-searches')
  .controller('SaveSearchModalController', SaveSearchModalController);

/* @ngInject */
function SaveSearchModalController($scope, $modalInstance) {

  var ok = function () {
    var name = $scope.queryName;
    $modalInstance.close(name);
  };

  var cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.cancel = cancel;
  $scope.ok = ok;
  $scope.queryName = '';
}
