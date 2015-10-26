'use strict';

describe('Directive: Search Bar', function () {

  var searchBar, $rootScope, $scope, savedSearchesService, searchHelper;

  beforeEach(module('udb.search'));
  beforeEach(module('udb.templates'));

  beforeEach(inject(function (_$rootScope_, $compile, _savedSearchesService_, $q, _searchHelper_){
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    savedSearchesService = _savedSearchesService_;
    searchHelper = _searchHelper_;

    spyOn(savedSearchesService, 'getSavedSearches').and.returnValue($q.resolve([]));

    $rootScope.queryString = 'city:leuven';
    $compile('<udb-search-bar></udb-search-bar>')($scope);
    $scope.$digest();

    searchBar = $scope.sb;
  }));

  it('should update the search bar when finding results for a given query string', function () {
    spyOn(searchBar, 'queryChanged');
    spyOn(searchHelper, 'setQueryString');

    searchBar.find('foo:bar');

    expect(searchHelper.setQueryString).toHaveBeenCalledWith('foo:bar');
    expect(searchBar.query).toEqual('foo:bar');
    expect(searchBar.queryChanged).toHaveBeenCalled();
  });

  it('should use the query active on the search bar when triggering a find without parameters', function () {
    spyOn(searchBar, 'queryChanged');
    spyOn(searchHelper, 'setQueryString');
    searchBar.query = 'beep:boop';

    searchBar.find();

    expect(searchHelper.setQueryString).toHaveBeenCalledWith('beep:boop');
    expect(searchBar.query).toEqual('beep:boop');
    expect(searchBar.queryChanged).toHaveBeenCalled();
  });

  it('should notify other components when the query has changed', function () {
    spyOn($rootScope, '$emit');

    searchBar.queryChanged();

    expect($rootScope.$emit).toHaveBeenCalledWith('searchBarChanged');
    expect($rootScope.$emit).toHaveBeenCalledWith('stopEditingQuery');
  });
});