'use strict';

describe('Service: Media Manager', function () {
  var mediaManager, $httpBackend, $q, CreateImageJob;
  var appConfig = {
    baseUrl: 'http://foo.bar/'
  };
  var jobLogger = jasmine.createSpyObj('jobLogger', ['addJob']);

  beforeEach(module('udb.media', function ($provide) {
    $provide.constant('appConfig', appConfig);
    $provide.provider('jobLogger', {
      $get: function () {
        return jobLogger;
      }
    });
  }));

  beforeEach(inject(function($injector){
    mediaManager = $injector.get('MediaManager');
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    CreateImageJob = $injector.get('CreateImageJob');
  }));

  it('should promise a media object when getting an image', function (done) {
    var expectedMediaObject = {
      id: 'some-image-id',
      '@id': 'some-image-id',
      '@type': 'schema:MediaObject',
      contentUrl: 'http://foo.bar',
      thumbnailUrl: 'http://foo.bar',
      description: 'description',
      copyrightHolder: 'Foo Bar'
    };
    var jsonMediaObject = {
      '@id': 'some-image-id',
      '@type': 'schema:MediaObject',
      'contentUrl': 'http://foo.bar',
      'thumbnailUrl': 'http://foo.bar',
      'description': 'description',
      'copyrightHolder': 'Foo Bar'
    };

    function assertMediaObject(mediaObject) {
      expect(mediaObject).toEqual(expectedMediaObject);
      done();
    }

    $httpBackend
      .expectGET('http://foo.bar/media/some-image-id')
      .respond(200, JSON.stringify(jsonMediaObject));

    mediaManager
      .getImage('some-image-id')
      .then(assertMediaObject);

    $httpBackend.flush();
  });

  it('should log the creation of an image', function (done) {
    var file = {},
        description = 'description',
        copyrightHolder = 'Foo Bar';

    function assertJobLogged() {
      expect(jobLogger.addJob).toHaveBeenCalled();
      done();
    }

    $httpBackend
      .expectPOST('http://foo.bar/images')
      .respond(200, {commandId: '182'});

    mediaManager
      .createImage(file, description, copyrightHolder);

    $httpBackend.flush();
    assertJobLogged();
  });
});