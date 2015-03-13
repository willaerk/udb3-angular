'use strict';

/**
 * @ngdoc function
 * @name udb.search.controller:SearchCtrl
 * @description
 * # SearchCtrl
 * Search controller
 */
angular
  .module('udb.search')
  .controller('Search', Search);

/* @ngInject */
function Search($scope, udbApi, LuceneQueryBuilder, $window, $location, $modal, SearchResultViewer, eventLabeller,
                searchHelper, $rootScope, eventExporter) {

  var queryBuilder = LuceneQueryBuilder;

  function getSearchQuery() {
    return searchHelper.getQuery();
  }

  $scope.resultViewer = new SearchResultViewer();
  $scope.queryErrors = [];
  $scope.realQuery = false;
  $scope.activeQuery = false;
  $scope.queryEditorShown = false;

  $scope.$watch(function () {
    return $location.search();
  }, function (searchParams) {

    if (searchParams.page) {
      $scope.resultViewer.currentPage = parseInt(searchParams.page);
    }

    if (searchParams.query) {
      var queryString = String(searchParams.query) || '';
      searchHelper.setQueryString(queryString);
    }
  }, true);

  /**
   * This debounce function can be used to delay searching when an input field changes.
   * @param {String} A query string used to find events.
   */
  var debouncedFindEvents = _.debounce(function (queryString) {
    findEvents(queryString);
  }, 1000);

  /**
   *
   * @param Query A query object used to update the interface and result viewer.
   */
  var updateQuery = function (query) {
    var realQuery = queryBuilder.unparse(query);
    $scope.resultViewer.queryChanged(realQuery);
    debouncedFindEvents(realQuery);

    if (realQuery !== query.originalQueryString) {
      $scope.realQuery = realQuery;
    } else {
      $scope.realQuery = false;
    }
  };

  /**
   * Fires off a search for events using a plain query string or a query object.
   * @param {String|Query} A query string or object to search with.
   */
  var findEvents = function (query) {
    var offset = ($scope.resultViewer.currentPage - 1) * $scope.resultViewer.pageSize;
    var queryString = typeof query === 'string' ? query : query.queryString;
    var eventPromise = udbApi.findEvents(queryString, offset);

    // Check if a query string is defined else clear the relevant search parameters.
    if (queryString) {
      $location.search({
        'query': getSearchQuery().queryString,
        'page': String($scope.resultViewer.currentPage)
      });
    } else {
      $location.search({
        'query': null,
        'page': null
      });
    }

    $scope.resultViewer.loading = true;

    eventPromise.then(function (pagedEvents) {
      $scope.resultViewer.setResults(pagedEvents);
    });
  };

  var label = function () {
    var labellingQuery = $scope.resultViewer.querySelected;

    if(labellingQuery) {
      labelActiveQuery();
    } else {
      labelSelection();
    }
  };

  var labelSelection = function () {

    var selectedIds = $scope.resultViewer.selectedIds;

    if (!selectedIds.length) {
      $window.alert('First select the events you want to label.');
      return;
    }

    var modal = $modal.open({
      templateUrl: 'templates/event-label-modal.html',
      controller: 'EventLabelModalCtrl'
    });

    modal.result.then(function (labels) {

      _.each(selectedIds, function (eventId) {
        var eventPromise = udbApi.getEventById(eventId);

        eventPromise.then(function (event) {
          event.labels = _.union((event.labels || []), labels);
        });
      });

      var eventIds = _.map(selectedIds, function (id) {
        return id.split('/').pop();
      });

      _.each(labels, function (label) {
        eventLabeller.labelEventsById(eventIds, label);
      });
    });
  };

  function labelActiveQuery() {
    var query = $scope.activeQuery,
      eventCount = $scope.resultViewer.totalItems;

    if (queryBuilder.isValid(query)) {
      var modal = $modal.open({
        templateUrl: 'templates/event-label-modal.html',
        controller: 'EventLabelModalCtrl'
      });

      modal.result.then(function (labels) {
        _.each(labels, function (label) {
          eventLabeller.labelQuery(query.queryString, label, eventCount);
        });
      });
    } else {
      $window.alert('provide a valid query to label');
    }
  }

  function exportEvents() {
    var exportingQuery = $scope.resultViewer.querySelected,
        query = $scope.activeQuery,
        eventCount,
        selectedIds = [];

    if(exportingQuery) {
      eventCount = $scope.resultViewer.totalItems;
    } else {
      selectedIds = $scope.resultViewer.selectedIds;

      if (!selectedIds.length) {
        $window.alert('First select the events you want to label.');
        return;
      } else {
        eventCount = selectedIds.length;
      }
    }

    eventExporter.activeExport.query = query;
    eventExporter.activeExport.eventCount = eventCount;
    eventExporter.activeExport.selection = selectedIds;

    if (query && query.queryString.length && queryBuilder.isValid(query)) {
      var modal = $modal.open({
        templateUrl: 'templates/event-export-modal.html',
        controller: 'EventExportController',
        controllerAs: 'exporter',
        size: 'lg'
      });
    } else {
      $window.alert('provide a valid query to export');
    }
  }

  $scope.exportEvents = exportEvents;
  $scope.label = label;

  $scope.startEditing = function () {
    $scope.queryEditorShown = true;
  };

  $scope.stopEditing = function () {
    $scope.queryEditorShown = false;
  };

  $rootScope.$on('startEditingQuery', $scope.startEditing);
  $rootScope.$on('stopEditingQuery', $scope.stopEditing);

  $scope.$watch(function () {
    var query = getSearchQuery();
    return query.queryString;
  }, function (queryString) {
    var query = queryBuilder.createQuery(queryString);

    $scope.activeQuery = query;

    if (queryBuilder.isValid(query)) {
      updateQuery(query);
      $scope.queryErrors = [];
    } else {
      $scope.queryErrors = query.errors;
    }

  });

  $scope.$watch('resultViewer.currentPage', function (newPageNr, oldPageNr) {
    if (newPageNr !== oldPageNr) {
      findEvents($scope.activeQuery);
      $window.scroll(0, 0);
    }
  });

}
