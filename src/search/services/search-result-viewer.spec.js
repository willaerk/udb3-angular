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

});
