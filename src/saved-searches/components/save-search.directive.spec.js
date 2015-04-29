'use strict'

describe('Directive: udbSaveSearch', function () {
  var $rootScope, $compile, modal;

  beforeEach(module('udb.core'))

  beforeEach(module('udb.templates'));

  beforeEach(module('udb.saved-searches', function ($provide) {
    //modal = jasmine.createSpyObj('$modal', ['open']);
    //$provide.service('$modal', modal);
  }));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$modal_) {
    modal = _$modal_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    spyOn(modal, 'open');
  }));


  it('shows a modal saving a search', function () {
    expect(modal.open).toHaveBeenCalled();
    $rootScope.queryString = 'city:leuven';
    var element = $compile('<udb-save-search udb-query-string="queryString"></udb-save-search>')($rootScope);
    $rootScope.$digest();
    element.find('.udb-save-query-ok-button').click();
  });

});
