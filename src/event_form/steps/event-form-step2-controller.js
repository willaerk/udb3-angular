(function () {
  'use strict';

  /**
   * @ngdoc function
   * @name udbApp.controller:EventFormStep2Ctrl
   * @description
   * # EventFormStep2Ctrl
   * Step 2 of the event form
   */
  angular
    .module('udb.event-form')
    .controller('EventFormStep2Ctrl', EventFormStep2Controller);

  /* @ngInject */
  function EventFormStep2Controller($scope, EventFormData, UdbOpeningHours) {

    // Scope vars.
    // main storage for event form.
    $scope.eventFormData = EventFormData;

    $scope.activeCalendarType = ''; // Current active calendar type.
    $scope.activeCalendarLabel = '';
    $scope.calendarLabels = [
      { 'label': 'Eén of meerdere dagen', 'id' : 'single', 'eventOnly' : true },
      { 'label': 'Van ... tot ... ', 'id' : 'periodic', 'eventOnly' : true },
      { 'label' : 'Permanent', 'id' : 'permanent', 'eventOnly' : false }
    ];
    $scope.hasOpeningHours = false;

    // Scope functions
    $scope.setCalendarType = setCalendarType;
    $scope.resetCalendar = resetCalendar;
    $scope.addTimestamp = addTimestamp;
    $scope.toggleStartHour = toggleStartHour;
    $scope.toggleEndHour = toggleEndHour;
    $scope.saveOpeninghHourDaySelection = saveOpeninghHourDaySelection;

    // Mapping between machine name of days and real output.
    var dayNames = {
      'monday' : 'Maandag',
      'tuesday' : 'Dinsdag',
      'wednesday' : 'Woensdag',
      'thursday' : 'Donderdag',
      'friday' : 'Vrijdag',
      'saturday' : 'Zaterdag',
      'sunday' : 'Zondag'
    };

    /**
     * Click listener on the calendar type buttons.
     * Activate the selected calendar type.
     */
    function setCalendarType(type) {

      EventFormData.showStep(3);
      $scope.activeCalendarType = type;

      for (var i = 0; i < $scope.calendarLabels.length; i++) {
        if ($scope.calendarLabels[i].id === type) {
          $scope.activeCalendarLabel = $scope.calendarLabels[i].label;
          break;
        }
      }

      // Check if previous calendar type was the same.
      // If so, we don't need to create new openinghours. Just show the previous entered data.
      if (EventFormData.calendarType === type) {
        return;
      }

      // A type is choosen, start a complet new calendar, removing old dat
      EventFormData.calendarType = type;
      $scope.hasOpeningHours = false;
      EventFormData.resetCalendar();

      if (type === 'single') {
        addTimestamp();
      }
      else if (type === 'periodic' || type === 'permanent') {
        EventFormData.addOpeningHour('', '', '');
      }

    }

    /**
     * Click listener to reset the calendar. User can select a new calendar type.
     */
    function resetCalendar() {
      $scope.activeCalendarType = '';
    }

    /**
     * Add a single date to the item.
     */
    function addTimestamp() {
      EventFormData.addTimestamp('', '', '');
    }

    /**
     * Toggle the starthour field for given timestamp.
     * @param timestamp
     *   Timestamp to change
     */
    function toggleStartHour(timestamp) {

      timestamp.showStartHour = !timestamp.showStartHour;

      // If we hide the textfield, empty all other time fields.
      if (!timestamp.showStartHour) {
        timestamp.startHour = '';
        timestamp.endHour = '';
        timestamp.showEndHour = false;
      }

    }

    /**
     * Toggle the endhour field for given timestamp
     * @param timestamp
     *   Timestamp to change
     */
    function toggleEndHour(timestamp) {

      timestamp.showEndHour = !timestamp.showEndHour;

      // If we hide the textfield, empty also the input.
      if (!timestamp.showEndHour) {
        timestamp.endHour = '';
      }

    }

    /**
     * Change listener on the day selection of opening hours.
     * Create human labels for the day selection.
     */
    function saveOpeninghHourDaySelection(index, daysOfWeek) {

      var humanValues = [];
      if (daysOfWeek instanceof Array) {
        for (var i in daysOfWeek) {
          humanValues.push(dayNames[daysOfWeek[i]]);
        }
      }

      EventFormData.openingHours[index].label = humanValues.join(', ');

    }

  }

})();
