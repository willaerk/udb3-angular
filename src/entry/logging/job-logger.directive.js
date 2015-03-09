'use strict';

/**
 * @ngdoc directive
 * @name udb.entry.directive:udbJobLog
 * @description
 * # udbJobLog
 */
angular
  .module('udb.entry')
  .directive('udbJobLog', udbJobLog);

/* @ngInject */
function udbJobLog(jobLogger, JobStates, EventExportJob) {
  return {
    templateUrl: 'templates/job-logger.directive.html',
    restrict: 'E',
    link: function postLink(scope, element, attrs) {
      scope.getQueuedJobs = jobLogger.getQueuedJobs;
      scope.getFinishedExportJobs = jobLogger.getFinishedExportJobs;
      scope.getFailedJobs = jobLogger.getFailedJobs;
      scope.hideJob = jobLogger.hideJob;
    }
  };
}
