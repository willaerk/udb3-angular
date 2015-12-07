'use strict';

describe('Factory: Event form data', function () {

  beforeEach(module('udb.event-form'));

  it('should indicate when the timing is not a valid periodic range', inject(function (EventFormData) {
    var timingData = [
      {
        type: 'periodic',
        start: new Date('2012-12-12'),
        end: null,
        valid: false
      },
      {
        type: 'periodic',
        start: null,
        end: new Date('2012-12-12'),
        valid: false
      },
      {
        type: 'permanent',
        start: new Date('2012-12-12'),
        end: null,
        valid: false
      },
      {
        type: 'periodic',
        start: new Date('2012-12-13'),
        end: new Date('2012-12-12'),
        valid: false
      },
      {
        type: 'periodic',
        start: new Date('2012-12-11'),
        end: new Date('2012-12-12'),
        valid: true
      }
    ];

    timingData.forEach(function (timing) {
      EventFormData.calendarType = timing.type;
      EventFormData.startDate = timing.start;
      EventFormData.endDate = timing.end;

      expect(EventFormData.hasValidPeriodicRange()).toEqual(timing.valid);
    });

  }));
});