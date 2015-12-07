'use strict';

describe('Controller: event form step 2', function () {

  beforeEach(module('udb.event-form'));

  var $controller, stepController, scope, $q, EventFormData, eventCrud;

  beforeEach(inject(function ($rootScope, $injector) {
    $controller = $injector.get('$controller');
    scope = $rootScope;
    $q = $injector.get('$q');
    EventFormData = $injector.get('EventFormData');
    stepController = $controller('EventFormStep2Controller', {
      $scope: scope,
    });
  }));

  it('should notify that the event timing has changed when toggling off the start time', function () {
    spyOn(stepController, 'eventTimingChanged');

    var timestamp = {
      startHour: '',
      endHour: '',
      showEndHour: true,
      showStartHour: false
    };

    stepController.toggleStartHour(timestamp);
    expect(stepController.eventTimingChanged).toHaveBeenCalled();
  });

  it('should notify that the event timing has changed when toggling off the end time', function () {
    spyOn(stepController, 'eventTimingChanged');

    var timestamp = {
      startHour: '',
      endHour: '',
      showEndHour: false,
      showStartHour: false
    };

    stepController.toggleStartHour(timestamp);
    expect(stepController.eventTimingChanged).toHaveBeenCalled();
  });

});