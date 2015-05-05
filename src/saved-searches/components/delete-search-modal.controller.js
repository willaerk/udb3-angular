'use strict';

/**
 * @ngdoc function
 * @name udb.entry.controller:DeleteSearchModalController
 * @description
 * # DeleteSearchModalController
 * Controller of the udb.entry
 */
angular
  .module('udb.saved-searches')
  .controller('DeleteSearchModalController', DeleteSearchModalController);

/* @ngInject */
function DeleteSearchModalController($scope, $modalInstance) {

  var confirm = function () {
    $modalInstance.close();
  };

  var cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.cancel = cancel;
  $scope.confirm = confirm;
}
