'use strict';

/**
 * @ngdoc function
 * @name udb.entry.controller:JobLogoController
 * @description
 * # Job logo controller
 * Controller of the udb.entry
 */
angular
  .module('udb.entry')
  .controller('JobLogoController', JobLogoController);

/* @ngInject */
function JobLogoController(JobLogoStates, jobLogger) {
  var jl = this;

  /**
   * Calculate the current state the logo should be in
   * @return {boolean} current state
   */
  jl.getCurrentState = function () {
    var stateChecks = [
      {
        state: JobLogoStates.WARNING,
        check: !_.isEmpty(jobLogger.getFailedJobs())
      },
      {
        state: JobLogoStates.COMPLETED,
        check: !_.isEmpty(jobLogger.getFinishedExportJobs())
      },
      {
        state: JobLogoStates.BUSY,
        check: jobLogger.hasActiveJobs()
      },
      {
        state: JobLogoStates.IDLE,
        // if you get this far there are no visible jobs
        check: true
      }
    ];

    var currentState = _.find(stateChecks, function (stateCheck) {
      return stateCheck.check;
    }).state;

    return currentState;
  };

  // set the initial state
  jl.state = jl.getCurrentState();
}
