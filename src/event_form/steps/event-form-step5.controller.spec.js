'use strict';

describe('Controller: event form step 5', function () {

  beforeEach(module('udb.event-form'));

  var $controller, stepController, scope, EventFormData;

  beforeEach(inject(function ($rootScope, $injector) {
    $controller = $injector.get('$controller');
    scope = $rootScope;
    EventFormData = $injector.get('EventFormData');
    stepController = $controller('EventFormStep5Controller', {
      $scope: scope,
      EventFormData: EventFormData
    });
  }));

  it('should set the right form data and save it when all ages is selected', function () {
    spyOn(scope, 'saveAgeRange');
    scope.ageRange = scope.ageRanges[0];
    scope.ageRangeChanged();

    expect(scope.eventFormData.ageRange).toEqual(-1);
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

    for (var caseName in testCases) {
      var testCase = testCases[caseName];

      scope.ageRange = testCase.range;
      scope.minAge = testCase.minAge;
      scope.saveAgeRange();

      expect(EventFormData.typicalAgeRange).toEqual(testCase.expectedResult);
    }
  });
});