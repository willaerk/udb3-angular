'use strict';

describe('Directive: Job Logo', function() {
  var $compile,
      $rootScope;

  var mockState = 'idle';

  beforeEach(module('udb.entry', function($controllerProvider) {
    $controllerProvider.register('JobLogoController', function (){
      this.getState = function () {
        return mockState;
      };
    });
  }));

  beforeEach(module('udb.templates'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
  }));

  it('renders the logo with the current job state', function () {
    var element = $compile("<udb-job-logo></udb-job-logo>")($rootScope);
    mockState = 'some-logo-state';
    $rootScope.$digest();
    expect(element.children(':first-child').attr('class')).toEqual('some-logo-state');
  });
});
