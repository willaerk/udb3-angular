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
    isPlace : false, // Is current item a place.
    showStep1 : true,
    showStep2 : false,
    showStep3 : false,
    showStep4 : false,
    showStep5 : false,

    /**
     * Show the given step.
     * @param int stepNumber
     */
    showStep: function(stepNumber) {
      console.log(stepNumber);
      this['showStep' + stepNumber] = true;
    },

    /**
     * Hide the given step.
     * @param int stepNumber
     */
    hideStep: function (stepNumber) {
      this['showStep' + stepNumber] = false;
    }

  };
}
