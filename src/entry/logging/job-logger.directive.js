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
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.getQueuedJobs = jobLogger.getQueuedJobs;
      scope.getFinishedExportJobs = jobLogger.getFinishedExportJobs;
      scope.getFailedJobs = jobLogger.getFailedJobs;

      scope.giveJobBarType = function (job) {
        var barType = 'info';

        if(job.getTaskCount()) {
          var failedTasks = _.filter(job.tasks, function (task) {
            return typeof task.state !== 'undefined' && task.state === 'failed';
          });

          if(failedTasks.length) {
            barType = 'warning';
            job.warning = failedTasks.length + ' mislukt';
          } else if(job.progress === 100) {
            barType = 'success';
          }
        } else if (job.getTemplateName() === 'base-job'){
          if(job.state === JobStates.STARTED) {
            barType = 'info';
          }

          if(job.state === JobStates.FAILED) {
            barType = 'danger';
          }

          if(job.state === JobStates.FINISHED) {
            barType = 'success';
          }
        }

        return barType;
      };
    }
  };
}
