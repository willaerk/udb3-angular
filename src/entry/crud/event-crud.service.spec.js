'use strict';

describe('Service: Event crud', function () {

  var eventCrud, $rootScope;

  beforeEach(module('udb.entry'));

  beforeEach(inject(function (_eventCrud_, _$rootScope_) {
    eventCrud = _eventCrud_;
    $rootScope = _$rootScope_;
  }));

  it('should persist major info after any of the basic properties changed', function () {
    var propertyChangedEvents = [
      'eventTypeChanged',
      'eventThemeChanged',
      'eventTimingChanged',
      'eventTitleChanged'
    ];
    var eventFormData = { 'some': 'data'};
    spyOn(eventCrud, 'updateMajorInfo');

    propertyChangedEvents.forEach(function (eventName) {
      eventCrud.updateMajorInfo.calls.reset();
      $rootScope.$emit(eventName, eventFormData);
      $rootScope.$apply();
      expect(eventCrud.updateMajorInfo).toHaveBeenCalledWith(eventFormData);
    });

  });
});