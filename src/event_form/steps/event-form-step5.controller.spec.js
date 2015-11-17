'use strict';

describe('Controller: event form step 5', function () {

  beforeEach(module('udb.event-form'));

  var $controller, stepController, scope, EventFormData, udbOrganizers, UdbOrganizer, $q, eventCrud;

  beforeEach(inject(function ($rootScope, $injector) {
    $controller = $injector.get('$controller');
    scope = $rootScope;
    EventFormData = $injector.get('EventFormData');
    UdbOrganizer = $injector.get('UdbOrganizer');
    $q = $injector.get('$q');
    udbOrganizers = jasmine.createSpyObj('udbOrganizers', ['suggestOrganizers']);
    eventCrud = jasmine.createSpyObj('eventCrud', [
      'updateOrganizer',
      'updateTypicalAgeRange',
      'deleteTypicalAgeRange',
      'deleteOfferOrganizer'
    ]);
    stepController = $controller('EventFormStep5Controller', {
      $scope: scope,
      EventFormData: EventFormData,
      udbOrganizers: udbOrganizers,
      eventCrud: eventCrud
    });
  }));

  it('should set the right form data and save it when all ages is selected', function () {
    spyOn(scope, 'saveAgeRange');
    scope.ageRange = scope.ageRanges[0];
    scope.ageRangeChanged(scope.ageRanges[0]);

    expect(scope.saveAgeRange).toHaveBeenCalled();
  });

  it('should check if the minimum age is in range of the selected age-range when saving', function () {
    var testCases = {
      'min and max set and not in range': {
        range: { min: 12, max: 18 },
        expectedInvalid: true,
        minAge: 10
      },
      'max set and in range': {
        range: { max: 18 },
        expectedInvalid: false,
        minAge: 10
      },
      'max set and not in range': {
        range: { max: 18 },
        expectedInvalid: true,
        minAge: 69
      },
      'range without boundaries': {
        range: { },
        expectedInvalid: false,
        minAge: 10
      }
    };
    eventCrud.updateTypicalAgeRange.and.returnValue($q.resolve());

    for (var caseName in testCases) {
      var testCase = testCases[caseName];

      scope.ageRange = testCase.range;
      scope.minAge = testCase.minAge;
      scope.saveAgeRange();

      expect(scope.invalidAgeRange).toEqual(testCase.expectedInvalid);
    }
  });

  it('should format the age-range when saving', function () {
    var testCases = {
      'all ages': {
        range: scope.ageRanges[0],
        minAge: null,
        expectedResult: null
      },
      'range with max and min': {
        range: { max: 18, min: 12 },
        minAge: 12,
        expectedResult: '12-18'
      },
      'range with only min': {
        range: { min: 18 },
        minAge: 21,
        expectedResult: '21-'
      }
    };
    eventCrud.updateTypicalAgeRange.and.returnValue($q.resolve());
    eventCrud.deleteTypicalAgeRange.and.returnValue($q.resolve());

    for (var caseName in testCases) {
      var testCase = testCases[caseName];

      scope.ageRange = testCase.range;
      scope.minAge = testCase.minAge;
      scope.saveAgeRange();

      expect(EventFormData.typicalAgeRange).toEqual(testCase.expectedResult);
    }
  });

  it('should suggest creating a new organizer when looking for one yields no results', function () {
    udbOrganizers.suggestOrganizers.and.returnValue($q.resolve([]));

    scope.getOrganizers('club');
    scope.$apply();

    expect(udbOrganizers.suggestOrganizers).toHaveBeenCalledWith('club');
    expect(scope.emptyOrganizerAutocomplete).toEqual(true);
  });

  it('should promise a list of organizers and show a loading state while waiting for it', function (done) {
    var organizer = new UdbOrganizer();
    udbOrganizers.suggestOrganizers.and.returnValue($q.resolve([organizer]));

    function assertOrganizers (organizers) {
      expect(organizers).toEqual([organizer]);
      expect(scope.loadingOrganizers).toEqual(false);
      done();
    }

    scope
      .getOrganizers('club')
      .then(assertOrganizers);

    expect(scope.loadingOrganizers).toEqual(true);
    scope.$apply();
  });

  it('should update an event organizer when selecting a new one', function () {
    spyOn(stepController, 'saveOrganizer');
    var organizer = new UdbOrganizer();

    scope.selectOrganizer(organizer);
    expect(stepController.saveOrganizer).toHaveBeenCalledWith(organizer);
  });

  it('should persist the organizer for the active event when saving', function () {
    eventCrud.updateOrganizer.and.returnValue($q.resolve());
    var organizer = new UdbOrganizer();

    stepController.saveOrganizer(organizer);
    expect(scope.savingOrganizer).toEqual(true);

    scope.$apply();
    expect(scope.savingOrganizer).toEqual(false);
  });

  it('should persist and reset the event organizer when removing it', function () {
    eventCrud.deleteOfferOrganizer.and.returnValue($q.resolve());
    spyOn(EventFormData, 'resetOrganizer');

    scope.deleteOrganizer();
    scope.$apply();

    expect(eventCrud.deleteOfferOrganizer).toHaveBeenCalled();
    expect(EventFormData.resetOrganizer).toHaveBeenCalled();
  });

  it('should show an async error when failing to remove the organizer', function () {
    eventCrud.deleteOfferOrganizer.and.returnValue($q.reject('BOOOM!'));
    spyOn(stepController, 'showAsyncOrganizerError');

    scope.deleteOrganizer();
    scope.$apply();

    expect(eventCrud.deleteOfferOrganizer).toHaveBeenCalled();
    expect(stepController.showAsyncOrganizerError).toHaveBeenCalled();
  })
});