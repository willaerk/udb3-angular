'use strict';

describe('Service: savedSearchesService', function() {
  var $httpBackend;
  var savedSearchesService;

  var baseUrl = 'http://example.com/';

  beforeEach(module('udb.core', function ($provide) {
    var appConfig = {
      baseUrl: baseUrl
    };

    $provide.constant('appConfig', appConfig);
  }));

  beforeEach(module('udb.saved-searches'));

  beforeEach(inject(function($injector, _savedSearchesService_) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    savedSearchesService = _savedSearchesService_;
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('posts a JSON-encoded title & query to /saved-searches', function() {
    $httpBackend
      .expectPOST(
        baseUrl + 'saved-searches/',
        '{"name":"In Leuven","query":"city:\\\"Leuven\\\""}',
        function (headers) {
          return headers['Content-Type'] == 'application/json';
        }
      )
      .respond(200, '{"jobId":"xyz"}');

    var response = savedSearchesService.createSavedSearch('In Leuven', 'city:"Leuven"');
    $httpBackend.flush();

    response.success(function (data) {
      expect(data).toEqual({jobId: 'xyz'});
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
});
