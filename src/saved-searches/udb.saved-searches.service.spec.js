'use strict';

describe('Service: savedSearchesService', function() {
  var $httpBackend;
  var savedSearchesService;

  var baseApiUrl = 'http://example.com/';

  beforeEach(module('udb.core', function ($provide) {
    var appConfig = {
      baseApiUrl: baseApiUrl
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
        baseApiUrl + 'saved-searches',
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
  })
});
