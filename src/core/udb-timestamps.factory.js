'use strict';

/**
 * @ngdoc service
 * @name udb.core.UdbTimestamps
 * @description
 * # UdbTimestamps
 * Contains timestamps info for the calendar
 */
angular
  .module('udb.core')
  .factory('UdbTimestamps', UdbTimestampsFactory);

/* @ngInject */
function UdbTimestampsFactory() {

  /**
   * @class UdbTimestamps
   * @constructor
   */
  var UdbTimestamps = function () {
    this.type = 'timestamps';
    this.timestamps = {};
  };

  UdbTimestamps.prototype = {
    parseJson: function (json) {

    },

    /**
     * Add a timestamp.
     */
    addTimestamp: function(date, timestart, timeend) {
      this.timestamps[date] = {
        'date' : date,
        'timestart' : timestart,
        'timeend' : timeend
      };
    },

    /**
     * Remove a timestamp.
     */
    removeTimestamp: function(date) {
      delete this.timestamps[date];
    }
  };

  return (UdbTimestamps);
}
