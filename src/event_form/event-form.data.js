'use strict';

/**
 * @ngdoc service
 * @name udb.core.EventFormData
 * @description
 * Contains data needed for the steps in the event form.
 */
angular
  .module('udb.event-form')
  .factory('EventFormData', EventFormDataFactory);

/* @ngInject */
function EventFormDataFactory() {
  return {
    item : {},
    isEvent : true, // Is current item an event.
    isPlace : false // Is current item a place.
  };
}
