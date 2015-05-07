'use strict';

describe('Service: savedSearchesService', function() {
  var $httpBackend;
  var savedSearchesService;
  var $rootScope;

  var baseUrl = 'http://example.com/';

  beforeEach(module('udb.core', function ($provide) {
    var appConfig = {
      baseUrl: baseUrl
    };

    $provide.constant('appConfig', appConfig);
  }));

  beforeEach(module('udb.saved-searches'));

  beforeEach(inject(function($injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    savedSearchesService = $injector.get('savedSearchesService');
    $rootScope = $injector.get('$rootScope');

    spyOn($rootScope, '$emit');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('posts a JSON-encoded title & query to /saved-searches', function() {
    var newSavedSearch = {
      name: 'In Leuven',
      query: 'city:"Leuven"'
    };

    $httpBackend
      .expectPOST(
        baseUrl + 'saved-searches/',
        JSON.stringify(newSavedSearch),
        function (headers) {
          return headers['Content-Type'] == 'application/json';
        }
      )
      .respond(200, '{"jobId":"xyz"}');

    var response = savedSearchesService.createSavedSearch('In Leuven', 'city:"Leuven"');
    $httpBackend.flush();

    response.success(function (data) {
      expect(data).toEqual({jobId: 'xyz'});
      expect($rootScope.$emit).toHaveBeenCalledWith('savedSearchesChanged', [newSavedSearch]);
    });
  });

  it('gets a list of JSON-encoded saved searches', function () {
    var expectedSavedSearches = [
      {"id": "126", "name": "alles in Tienen", "query": "city:Tienen"},
      {"id": "127", "name": "alles in Leuven", "query": "city:leuven"}
    ];

    $httpBackend
      .expectGET(baseUrl + 'saved-searches/')
      .respond(200, JSON.stringify(expectedSavedSearches));

    var response = savedSearchesService.getSavedSearches();
    $httpBackend.flush();

    response.then(function (savedSearches) {
      expect(savedSearches).toEqual(expectedSavedSearches);
    })
  });

  it('requests to delete a saved search and receives a job', function () {
    var searchId = '1337';

    $httpBackend
      .expectDELETE(baseUrl + 'saved-searches/' + searchId)
      .respond(200, '{"jobId":"xyz"}');

    var response = savedSearchesService.deleteSavedSearch(searchId);
    $httpBackend.flush();

    response.success(function (data) {
      expect(data).toEqual({jobId: 'xyz'});
      expect($rootScope.$emit).toHaveBeenCalledWith('savedSearchesChanged', []);
    });
  });
});
