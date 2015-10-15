'use strict';

describe('Controller: Saved Searches List', function () {
  var savedSearchesService, savedSearchesListController, $scope, $uibModal, modalInstance, $q;

  var savedSearchId = 'some-saved-search-id';
  var aSavedSearch = {id:savedSearchId, name: 'some query name', query: 'q:uery'};
  var savedSearchesRequest, apiRequest, codemirrorCallback;

  beforeEach(module('udb.saved-searches'));
  beforeEach(module('udb.templates'));

  beforeEach(inject(function($controller, $rootScope, _$uibModal_, _savedSearchesService_, _$q_){
    $q = _$q_;
    $scope = $rootScope.$new();
    $uibModal = _$uibModal_;
    savedSearchesService = _savedSearchesService_;

    var original = $uibModal.open;
    spyOn($uibModal, 'open').and.callFake(function () {
      modalInstance = original.apply(null, arguments);
      return modalInstance;
    });

    spyOn(savedSearchesService, 'deleteSavedSearch').and.callFake(function() {
      apiRequest = $q.defer();
      return apiRequest.promise;
    });

    spyOn(savedSearchesService, 'getSavedSearches').and.callFake(function() {
      savedSearchesRequest = $q.defer();
      return savedSearchesRequest.promise;
    });

    savedSearchesListController = $controller('SavedSearchesListController', {
      $scope: $scope,
      savedSearchesService: savedSearchesService,
      $uibModal: $uibModal,
      $rootScope: $scope
    });
  }));

  beforeEach(function () {
    savedSearchesRequest.resolve([aSavedSearch]);
    $scope.$digest();
  });

  it('fetches the saved searches for the active user', function () {
    expect(savedSearchesService.getSavedSearches).toHaveBeenCalled();
    expect($scope.savedSearches).toContain(aSavedSearch);
  });

  describe('when trying to delete a saved search', function () {
    beforeEach(function () {
      savedSearchesListController.deleteSavedSearch(savedSearchId);
      $scope.$digest();
    });

    it('show a confirmation modal when trying to delete a saved search', function () {
      expect($uibModal.open).toHaveBeenCalled();
    });

    it('does not delete the search when the modal is dismissed', function () {
      modalInstance.dismiss('cancel');
      $scope.$digest();
      expect(savedSearchesService.deleteSavedSearch).not.toHaveBeenCalled();
    });

    it('deletes the saved search when confirming the modal', function () {
      modalInstance.close();
      $scope.$digest();
      apiRequest.resolve();
      expect(savedSearchesService.deleteSavedSearch).toHaveBeenCalledWith(savedSearchId);
    });

    it('shows an error modal when the search cannot be deleted', function () {
      modalInstance.close();
      $scope.$digest();
      apiRequest.reject();
      $scope.$digest();
      expect($uibModal.open.calls.count()).toEqual(2);
    });
  });
});
