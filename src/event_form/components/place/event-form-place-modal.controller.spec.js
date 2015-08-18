'use strict';

describe('Controller: Event form place modal Controller', function () {

  beforeEach(module('udb.event-form'));

  var createPlaceController, modalInstance, $scope, eventCrud, UdbPlace, location, categories, $q, BaseJob;

  beforeEach(inject(function ($rootScope, $injector) {
    var $controller = $injector.get('$controller');
    modalInstance = {
      close: jasmine.createSpy('modalInstance.close'),
      dismiss: jasmine.createSpy('modalInstance.dismiss'),
      result: {
        then: jasmine.createSpy('modalInstance.result.then')
      }
    };
    $scope = $rootScope.$new();
    eventCrud = $injector.get('eventCrud');
    UdbPlace = $injector.get('UdbPlace');
    location = new UdbPlace();
    categories = [
      {
        "label": "Monument",
        "id": "0.14.0.0.0",
        "primary": true
      },
      {
        "label": "Natuur, park of tuin",
        "id": "0.15.0.0.0",
        "primary": true
      }
    ];
    createPlaceController = $controller('EventFormPlaceModalController', {
      $scope: $scope,
      $modalInstance: modalInstance,
      eventCrud: eventCrud,
      UdbPlace: UdbPlace,
      location: location,
      categories: categories
    });
    $q = $injector.get('$q');
    BaseJob = $injector.get('BaseJob');
  }));

  it('should close the modal when canceling the creation of a new place', function () {
    createPlaceController.cancel();
    expect(modalInstance.dismiss).toHaveBeenCalled();
  });

  it('should a create a new place and pass it along as the result of the modal', function () {
    var deferredJob = $q.defer();
    var jobPromise = deferredJob.promise;

    spyOn(eventCrud, 'createPlace').and.returnValue(jobPromise);

    createPlaceController.newPlace.type = categories[0];

    createPlaceController.savePlace();
    deferredJob.resolve(new BaseJob('some command id'));
    $scope.$digest();

    expect(eventCrud.createPlace).toHaveBeenCalled();
    expect(modalInstance.close).toHaveBeenCalledWith(createPlaceController.newPlace);
  })
});