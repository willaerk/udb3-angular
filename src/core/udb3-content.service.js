'use strict';

/**
 * @ngdoc service
 * @name udb.core.Udb3Content
 * @description
 * Service to get udb3 content.
 */
angular
  .module('udb.core')
  .service('udb3Content', Udb3Content);

/* @ngInject */
function Udb3Content($q, $http, appConfig) {

  /**
   * Get the udb3 content for the current user.
   */

  this.getUdb3ContentForCurrentUser = function() {

    return $http.get(appConfig.baseApiUrl + 'udb3_content_current_user');

  };

}
