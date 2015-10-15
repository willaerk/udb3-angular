'use strict';

describe('Service: SearchResultViewer', function () {

  // load the service's module
  beforeEach(module('udb.search'));

  // instantiate service
  var SearchResultViewer;
  beforeEach(inject(function (_SearchResultViewer_) {
    SearchResultViewer = _SearchResultViewer_;
  }));

  it('should show the first page when the query changes', function () {
    var viewer = new SearchResultViewer();
    viewer.queryChanged('some new query');
    expect(viewer.currentPage).toBe(1);
  });

  it('should update page size and total events when changing results', function () {
    var viewer = new SearchResultViewer(10);
    var results = {
      itemsPerPage: 30,
      totalItems: 100,
      member: []
    };

    expect(viewer.pageSize).toBe(10);
    expect(viewer.totalItems).toBe(0);

    viewer.setResults(results);

    expect(viewer.pageSize).toBe(30);
    expect(viewer.totalItems).toBe(100);
  });

  it('should not reset the active page on the initial search', function () {
    var viewer = new SearchResultViewer(10, 3);
    expect(viewer.currentPage).toEqual(3);

    viewer.queryChanged('city:leuven');
    expect(viewer.currentPage).toEqual(3);

    // a subsequent search should trigger a page reset
    viewer.queryChanged('city:tienen');
    expect(viewer.currentPage).toEqual(1);
  });

});
