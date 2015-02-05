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
function EventExportController($modalInstance, udbApi, eventExporter, queryFields, $window) {

  var exporter = this;

  exporter.dayByDay = false;

  exporter.fields = _.indexBy(queryFields, 'name');
  _.forEach(exporter.fields, function(n, key) {
    exporter.fields[key] = false;
  });

  exporter.fieldSorters = [];

  exporter.getUnsortedFields = function (includeName) {
    var sortedFieldNames = _.map(exporter.fieldSorters, 'fieldName');

    if(includeName) {
      sortedFieldNames = _.without(sortedFieldNames, includeName);
    }

    var unsortedFields = _.filter(queryFields, function (field) {
      return !_.contains(sortedFieldNames, field.name);
    });

    return unsortedFields;
  };

  exporter.addSorter = function () {
    var unsortedFields = exporter.getUnsortedFields();

    if(unsortedFields.length) {
      var fieldSorter = {
        fieldName: unsortedFields[0].name,
        order: 'asc'
      };

      exporter.fieldSorters.push(fieldSorter);
    } else {
      $window.alert('Already sorting on every possible field');
    }

  };
  exporter.addSorter();

  exporter.exportFormats = [
    {
      type: 'json',
      label: 'Als json',
      description: 'Exporteren naar event-ld om de informatie voor ontwikkelaars beschikbaar te maken.'
    },
    {
      type: 'csv',
      label: 'Als tabel',
      description: 'Met spreadsheetprogramma\'s als Microsoft Excel kun je eenvoudig CSV-bestanden maken en bewerken.'
    }
  ];

  /**
   * This is a list of steps that the user has to navigate through.
   * You can add a callback to its incomplete property which will be used to check if a step is completed.
   */
  exporter.steps = [
    { name: 'format' },
    { name: 'filter',
      incomplete: function () {
        return !_.find(exporter.fields, function(field) {
          return field;
        });
      }
    },
    //{name: 'sort' },
    { name: 'confirm' }
  ];

  var activeStep = 0;
  exporter.nextStep = function () {
    if(exporter.isStepCompleted()) {
      setActiveStep(activeStep + 1);
    }
  };

  exporter.previousStep = function () {
    setActiveStep(activeStep - 1);
  };

  exporter.isStepCompleted = function () {

    if(activeStep === -1) {
      return true;
    }

    var incompleteCheck = exporter.steps[activeStep].incomplete;
    return ((typeof incompleteCheck === 'undefined') || (typeof incompleteCheck === 'function' && !incompleteCheck()));
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
    var includedFieldNames = _.map(exporter.fields, function (value, fieldName) {
      return value ? fieldName : '';
    });
    includedFieldNames = _.without(includedFieldNames, '');

    //var order = _.indexBy(exporter.fieldSorters, 'fieldName');

    eventExporter.export(exporter.format, exporter.email, includedFieldNames, exporter.dayByDay);
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
