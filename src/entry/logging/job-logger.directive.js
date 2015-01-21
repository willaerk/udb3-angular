'use strict';

/**
 * @ngdoc directive
 * @name udb.entry.directive:udbJobLog
 * @description
 * # udbJobLog
 */
angular.module('udb.entry')
  .directive('udbJobLog', udbJobLog);

/* @ngInject */
function udbJobLog(jobLogger) {
  return {
    restrict: 'C',
    link: function postLink(scope, element, attrs) {
      scope.jobs = jobLogger.getJobs();

      scope.hasJobs = function () {
        return !!_.size(scope.jobs);
      };

      scope.giveJobBarType = function (job) {
        var barType = 'info';

        if(job.type === 'batch') {
          var failedTags = _.filter(job.events, function (event) {
            return typeof event.tagged !== 'undefined' && event.tagged === false;
          });

          if(failedTags.length) {
            barType = 'warning';
            job.warning = failedTags.length + ' mislukt';
          } else if(job.progress === 100) {
            barType = 'success';
          }
        } else if (job.type === 'single'){
          if(job.state === 'started') {
            barType = 'info';
          }

          if(job.state === 'failed') {
            barType = 'danger';
          }

          if(job.state === 'finished'){
            barType = 'success';
          }
        }

        return barType;
      };
    }
  };
}
