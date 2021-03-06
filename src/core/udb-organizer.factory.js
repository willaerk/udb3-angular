'use strict';

/**
 * @ngdoc service
 * @name udb.core.UdbOrganizer
 * @description
 * # UdbOrganizer
 * UdbOrganizer factory
 */
angular
  .module('udb.core')
  .factory('UdbOrganizer', UdbOrganizerFactory);

/* @ngInject */
function UdbOrganizerFactory() {

  /**
   * @class UdbOrganizer
   * @constructor
   */
  var UdbOrganizer = function (jsonOrganizer) {
    this.id = '';
    this.name = '';

    if (jsonOrganizer) {
      this.parseJson(jsonOrganizer);
    }
  };

  UdbOrganizer.prototype = {
    parseJson: function (jsonOrganizer) {
      this.id = jsonOrganizer['@id'].split('/').pop();
      this.name = jsonOrganizer.name || '';
      this.addresses = jsonOrganizer.addresses || [];
      this.email = jsonOrganizer.email || [];
      this.phone = jsonOrganizer.phone || [];
      this.url = jsonOrganizer.url || [];
    }
  };

  return (UdbOrganizer);
}
