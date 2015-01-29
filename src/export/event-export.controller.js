'use strict';

/**
 * @ngdoc function
 * @name udb.export.controller:EventExportController
 * @description
 * # EventExportController
 * Controller of the udb.export
 */
angular
  .module('udb.export')
  .controller('EventExportController', EventExportController);

/* @ngInject */
function EventExportController($modalInstance, udbApi, eventExporter, queryFields) {

  var exporter = this;

  exporter.fields = _.indexBy(queryFields, 'name');

  exporter.exportFormats = [
    {
      type: 'json',
      label: 'als json',
      description: 'Exporteren naar event-ld om de informatie voor ontwikkelaars beschikbaar te maken.'
    },
    {
      type: 'csv',
      label: 'als tabel',
      description: 'Met spreadsheetprogramma\'s als Microsoft Excel kun je eenvoudig CSV-bestanden maken en bewerken.'
    }
  ];

  exporter.steps = [
    {name: 'format' },
    //{name: 'filter', incomplete: function () {
    //  return (exporter.fields.length === 0);
    //} },
    //{name: 'sort' },
    {name: 'confirm' }
  ];

  var activeStep = 0;
  exporter.nextStep = function () {
    var incompleteCheck = exporter.steps[activeStep].incomplete;

    if((typeof incompleteCheck === 'undefined') || (typeof incompleteCheck === 'function' && !incompleteCheck())) {
      setActiveStep(activeStep + 1);
    }
  };

  exporter.previousStep = function () {
    setActiveStep(activeStep - 1);
  };

  function setActiveStep(stepIndex) {
    if(stepIndex < 0) {
      activeStep = 0;
    } else if(stepIndex > exporter.steps.length) {
      activeStep = exporter.steps.length;
    } else {
      activeStep = stepIndex;
    }
  }

  exporter.getActiveStepName = function () {

    if(activeStep === -1) {
      return 'finished';
    }

    return exporter.steps[activeStep].name;
  };

  exporter.onLastStep = function () {
    return activeStep >= (exporter.steps.length - 1);
  };

  exporter.export = function () {
    eventExporter.export(exporter.format, exporter.email);
    activeStep = -1;
  };

  exporter.format = exporter.exportFormats[0].type;
  exporter.email = '';

  // TODO: I'm not sure which property to check for a valid email address
  udbApi.getMe().then(function (user) {
    if(user.email) {
      exporter.email = user.email;
    }
  });

  exporter.close = function () {
    $modalInstance.dismiss('cancel');
  };

  exporter.eventCount = eventExporter.activeExport.eventCount;
}
