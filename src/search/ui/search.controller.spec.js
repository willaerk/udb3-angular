'use strict';

describe('Controller: Search', function() {
  var $scope, $window, udbApi, $controller, eventLabeller = null;

  beforeEach(module('udb.core', function ($translateProvider) {
    $translateProvider.translations('en', {
      'EVENT-EXPORT': {
        'QUERY-IS-MISSING': 'An export is only possible after you have launched a search query'
      }
    });

    $translateProvider.preferredLanguage('en');

  }));

  beforeEach(module('udb.search'));

  beforeEach(inject(function($rootScope, _$controller_) {
    $controller = _$controller_;
    $scope = $rootScope.$new();
  }));

  beforeEach(function () {
    $window = {
      alert: jasmine.createSpy('alert')
    };
    udbApi = jasmine.createSpyObj('udbApi', ['findEvents', 'getEventById']);
  });

  it('alerts if there is no query when trying to export events', function() {
    var controller = $controller(
        'Search', {
          $scope: $scope,
          $window: $window,
          udbApi: udbApi,
          eventLabeller: eventLabeller
        }
    );

    expect($scope.activeQuery).toEqual(false);

    $scope.resultViewer.selectedIds = ['foo', 'bar'];
    $scope.exportEvents();

    // Explicitly start the digest cycle in order to let $translate's promises
    // to be resolved.
    $scope.$digest();

    expect($window.alert).toHaveBeenCalledWith('An export is only possible after you have launched a search query');
  });
});
