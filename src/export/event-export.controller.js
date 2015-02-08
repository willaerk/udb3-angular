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

  exporter.eventProperties = [
    { name: 'name', include: true, sortable: false, excludable: false},
    { name: 'description', include: false, sortable: false, excludable: true},
    { name: 'keywords', include: false, sortable: false, excludable: true},
    { name: 'calendarSummary', include: true, sortable: false, excludable: false},
    { name: 'image', include: true, sortable: false, excludable: true},
    { name: 'location', include: true, sortable: false, excludable: false},
    { name: 'organizer', include: false, sortable: false, excludable: true},
    { name: 'bookingInfo', include: true, sortable: false, excludable: true},
    { name: 'creator', include: false, sortable: false, excludable: true},
    { name: 'terms', include: true, sortable: false, excludable: true},
    { name: 'created', include: false, sortable: false, excludable: true},
    { name: 'publisher', include: false, sortable: false, excludable: true},
    { name: 'endDate', include: false, sortable: false, excludable: true},
    { name: 'startDate', include: false, sortable: false, excludable: true},
    { name: 'calendarType', include: false, sortable: false, excludable: true},
    { name: 'sameAs', include: false, sortable: false, excludable: true},
    { name: 'typicalAgeRange', include: false, sortable: false, excludable: true},
    { name: 'language', include: false, sortable: false, excludable: true}
  ];

  //exporter.fieldSorters = [];
  //
  //exporter.getUnsortedFields = function (includeName) {
  //  var sortedFieldNames = _.map(exporter.fieldSorters, 'fieldName');
  //
  //  if(includeName) {
  //    sortedFieldNames = _.without(sortedFieldNames, includeName);
  //  }
  //
  //  var unsortedFields = _.filter(queryFields, function (field) {
  //    return !_.contains(sortedFieldNames, field.name);
  //  });
  //
  //  return unsortedFields;
  //};
  //
  //exporter.addSorter = function () {
  //  var unsortedFields = exporter.getUnsortedFields();
  //
  //  if(unsortedFields.length) {
  //    var fieldSorter = {
  //      fieldName: unsortedFields[0].name,
  //      order: 'asc'
  //    };
  //
  //    exporter.fieldSorters.push(fieldSorter);
  //  } else {
  //    $window.alert('Already sorting on every possible field');
  //  }
  //
  //};
  //exporter.addSorter();

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
        return !_.find(exporter.eventProperties, function(property) {
          return property.include === true;
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
    var includedProperties = _.pluck(_.filter(exporter.eventProperties, 'include'), 'name');

    eventExporter.export(exporter.format, exporter.email, includedProperties, exporter.dayByDay);
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
