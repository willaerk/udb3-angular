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
  var UdbOrganizer = function () {
    this.id = '';
    this.title = {};
  };

  UdbOrganizer.prototype = {
    parseJson: function (jsonOrganizer) {
      this.id = jsonOrganizer['@id'].split('/').pop();
      this.name = jsonOrganizer.name || '';
      this.addresses = jsonOrganizer.addresses || [];
      this.email = jsonOrganizer.email || [];
      this.phone = jsonOrganizer.phone || [];
      this.url = jsonOrganizer.url || [];
    },

    /**
     * Set the name of the event for a given langcode.
     */
    setName: function(name, langcode) {
      this.name[langcode] = name;
    },

    /**
     * Get the name of the event for a given langcode.
     */
    getName: function(langcode) {
      return this.name[langcode];
    }

  };

  return (UdbOrganizer);
}
