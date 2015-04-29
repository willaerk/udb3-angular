'use strict'

describe('Directive: udbSaveSearch', function () {
  var $rootScope, $compile, modal, modalInstance, $q;

  var name = 'In Leuven';
  var deferredModalResult;
  var savedSearchesService;

  beforeEach(module('udb.core'))

  beforeEach(module('udb.templates'));

  beforeEach(inject(function(_$rootScope_, _$compile_, _$modal_, _$q_) {
    modal = _$modal_;
    $rootScope = _$rootScope_;
    $compile = _$compile_;
    $q = _$q_;

    var original = modal.open;

    spyOn(modal, 'open').andCallFake(function () {
       modalInstance = original.apply(null, arguments);
       return modalInstance;
    });
  }));


  it('shows a modal saving a search', function () {
    $rootScope.queryString = 'city:leuven';
    var element = $compile('<udb-save-search udb-query-string="queryString"></udb-save-search>')($rootScope);
    $rootScope.$digest();
    element.find('a').triggerHandler('click');
    expect(modal.open).toHaveBeenCalled();

    modalInstance.close(name);
  });
});
