'use strict';

describe('Directive: Job Logo', function() {
  var $compile,
      $rootScope;

  beforeEach(module('udb.entry', function($controllerProvider) {
    $controllerProvider.register('JobLogoController', function ($scope){
    });
  }));

  beforeEach(module('udb.templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('renders a logo', function() {
    var element = $compile("<udb-job-logo></udb-job-logo>")($rootScope);
    $rootScope.$digest();
    expect(element.html()).toContain("<p>I'm a logo</p>");
  });
});
