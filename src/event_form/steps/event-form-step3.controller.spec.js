'use strict';

describe('Controller: event form step 3', function (){

  beforeEach(module('udb.event-form'));

  var $controller, stepController, scope;

  beforeEach(inject(function ($rootScope, $injector) {
    $controller = $injector.get('$controller');
    scope = $rootScope;
    stepController = $controller('EventFormStep3Controller', {
      $scope: scope
    })
  }));

  it('should fetch a list of places by zipcode when a city is selected', function () {
    var zipcode = '1234';
    spyOn(stepController, 'getLocations');

    stepController.selectCity({zip: zipcode}, 'some-city-id');

    expect(stepController.getLocations).toHaveBeenCalledWith(zipcode);
  });

  it('should return a list of places in a city filtered by address', function () {
    var filterString = 'straat';
    var cityFilter = stepController.filterCityLocations(filterString);
    var locations = [
      {
        id: 'a-place-id',
        name: 'do-not-filter-me',
        address: {
          streetAddress: 'Daalstraat 114'
        }
      },
      {
        id: 'a-place-id',
        name: 'filter-me',
        address: {
          streetAddress: 'Daalstraaat 114'
        }
      }
    ];

    var filteredPlaces = locations.filter(cityFilter);

    expect(filteredPlaces).toEqual([locations[0]]);
  });

  it('should return a list of places in a city filtered by name', function () {
    var filterString = 'do-not-filter-me';
    var cityFilter = stepController.filterCityLocations(filterString);
    var locations = [
      {
        id: 'a-place-id',
        name: 'do-not-filter-me',
        address: {
          streetAddress: 'Daalstraat 114'
        }
      },
      {
        id: 'a-place-id',
        name: 'filter-me',
        address: {
          streetAddress: 'Daalstraat 114'
        }
      }
    ];

    var filteredPlaces = locations.filter(cityFilter);

    expect(filteredPlaces).toEqual([locations[0]]);
  });

  it('should indicate that a city-place-search has happened to suggest creating a new place when no results are available', function () {
    // whenever getLocations() is called this flag is flipped to false
    // searching for places should make it true
    scope.locationsSearched = false;

    [{
      id: 'a-place-id',
      name: 'do-not-filter-me',
      address: {
        streetAddress: 'Daalstraat 114'
      }
    }].filter(stepController.filterCityLocations('some-query'));

    expect(scope.locationsSearched).toBeTruthy();
  });
});
