'use strict';

describe('Directive: Datepicker', function () {

  var $rootScope, $compile, dateChangeListener, $scope;

  beforeEach(module('udb.core'));

  beforeEach(inject(function(_$compile_, _$rootScope_){
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    dateChangeListener = jasmine.createSpy('dateChangeListener');
    $scope.dateChangeListener = dateChangeListener;
    $scope.date = new Date('2015-12-10');
  }));

  function getDatepicker() {
    var element = $compile(
      '<div udb-datepicker' +
      '  highlight-date="2015-8-12"' +
      '  ng-change="dateChangeListener()"' +
      '  ng-model="date">' +
      '</div>'
    )($scope);

    $scope.$digest();

    return element.data('datepicker');
  }

  it('should not update the view value when the date has not changed', function () {
    var picker = getDatepicker();
    var expectedDate = new Date('2015-12-10');
    var newDate = new Date('2015-12-10');

    picker.setDate(newDate);

    expect(dateChangeListener).not.toHaveBeenCalled();
    expect($scope.date).toEqual(expectedDate);
  });

  it('should update the view value when the selected date changes', function () {
    var picker = getDatepicker();
    var expectedDate = new Date('2015-12-16');
    var newDate = new Date('2015-12-16');

    picker.setDate(newDate);

    expect(dateChangeListener).toHaveBeenCalled();
    expect($scope.date).toEqual(expectedDate);
  });
});